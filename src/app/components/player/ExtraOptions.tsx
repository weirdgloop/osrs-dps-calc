import React from 'react';
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';
import forinthry_surge from '@/public/img/misc/forinthry_surge.webp';
import soulreaper_axe from '@/public/img/misc/soulreaper_axe.png';
import ba_attacker from '@/public/img/misc/ba_attacker.webp';
import chinchompa from '@/public/img/misc/chinchompa.png';
import BuffToggle from '@/app/components/player/buffs/BuffToggle';
import BuffNumberInput from '@/app/components/player/buffs/BuffNumberInput';

const ExtraOptions: React.FC = () => (
  <div className="px-6 my-4">
    <div className="mt-2 mb-4">
      <BuffToggle
        buff="onSlayerTask"
        icon={<img src={slayer.src} width={18} className="inline-block" alt="" />}
        label="On Slayer task"
        help="Black mask and slayer helmet give bonuses while you are on a Slayer task."
      />
      <BuffToggle
        buff="inWilderness"
        icon={<img src={skull.src} width={18} className="inline-block" alt="" />}
        label="In the Wilderness"
        help="Some weapons give bonuses while you are in the Wilderness."
      />
      <BuffToggle
        buff="forinthrySurge"
        icon={<img src={forinthry_surge.src} width={18} className="inline-block" alt="" />}
        label="Forinthry Surge"
        help="Provides a bonus against revenants."
      />
      <BuffToggle
        buff="kandarinDiary"
        icon={<img src={diary.src} width={18} className="inline-block" alt="" />}
        label="Kandarin Hard Diary"
        help="10% activation chance increase to enchanted bolts."
      />
      <BuffNumberInput
        buff="soulreaperStacks"
        min={0}
        max={5}
        icon={<img src={soulreaper_axe.src} width={18} className="inline-block" alt="" />}
        label="Soul stacks"
        help="When using the soulreaper axe, every hit gives a soul stack."
      />
      <BuffNumberInput
        buff="baAttackerLevel"
        min={0}
        max={5}
        icon={<img src={ba_attacker.src} className="inline-block h-fit" alt="" />}
        label="BA Attacker level"
        help="When fighting Penance Fighters and Penance Archers, your attacker level provides extra damage."
      />
      <BuffNumberInput
        buff="chinchompaDistance"
        min={1}
        max={10}
        icon={<img src={chinchompa.src} className="inline-block h-fit" alt="" />}
        label="Chinchompa distance (tiles)"
        help="When using chinchompas, accuracy is modified based on distance to the target."
      />
    </div>
  </div>
);

export default ExtraOptions;
