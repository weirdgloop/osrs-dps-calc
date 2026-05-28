import { PlayerEquipment } from '@/types/Player';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { getCdnImage, RenderData } from '@/utils';
import { StaticImageData } from 'next/image';
import head from '@/public/img/slots/head.png';
import cape from '@/public/img/slots/cape.png';
import neck from '@/public/img/slots/neck.png';
import ammo from '@/public/img/slots/ammo.png';
import weapon from '@/public/img/slots/weapon.png';
import body from '@/public/img/slots/body.png';
import shield from '@/public/img/slots/shield.png';
import legs from '@/public/img/slots/legs.png';
import hands from '@/public/img/slots/hands.png';
import feet from '@/public/img/slots/feet.png';
import ring from '@/public/img/slots/ring.png';
import { useLoadouts, usePlayer } from '@/state/LoadoutStore';
import { useIssues } from '@/state/IssuesStore';
import UserIssueWarning from '@/app/components/generic/UserIssueWarning';

const PlaceholderRenderData: RenderData<keyof PlayerEquipment, { image: StaticImageData }> = {
  head: { image: head },
  cape: { image: cape },
  neck: { image: neck },
  ammo: { image: ammo },
  weapon: { image: weapon },
  body: { image: body },
  shield: { image: shield },
  legs: { image: legs },
  hands: { image: hands },
  feet: { image: feet },
  ring: { image: ring },
};

interface EquipmentGridSlotProps {
  slot: keyof PlayerEquipment;
}

const EquipmentGridSlot: React.FC<EquipmentGridSlotProps> = observer(({ slot }) => {
  const { loadoutId, basePlayer, updateBasePlayer } = usePlayer();
  const { equipmentIssues } = useIssues();

  const { image: placeholderImage } = PlaceholderRenderData[slot];
  const eq = basePlayer.equipment[slot];

  // Determine whether there's any issues with this element
  const issues = equipmentIssues.get(loadoutId)
    ?.filter((i) => i.slot === slot)
    ?? [];

  return (
    <div className="h-[40px] w-[40px] relative">
      {
        issues.length > 0 && (
          <UserIssueWarning className="absolute top-[-10px] right-[-10px]" issue={issues[0].message} />
        )
      }
      <button
        type="button"
        className={`flex justify-center items-center h-[40px] w-[40px] bg-dark-400 border-dark-400 border transition-colors rounded ${eq ? 'cursor-pointer hover:border-red' : ''}`}
        data-slot={slot}
        data-tooltip-id="tooltip"
        data-tooltip-content={eq?.name}
        onMouseDown={() => {
          if (eq) {
            updateBasePlayer({ equipment: { [slot]: null } });
          }
        }}
      >
        {eq?.image ? (
          <img src={getCdnImage(`equipment/${eq.image}`)} alt={eq.name} />
        ) : (
          <img className="opacity-30 filter invert" src={placeholderImage.src} alt={slot} draggable={false} />
        )}
      </button>
    </div>
  );
});

export default EquipmentGridSlot;
