import React from 'react';
import { observer } from 'mobx-react-lite';
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';
import forinthry_surge from '@/public/img/misc/forinthry_surge.webp';
import soulreaper_axe from '@/public/img/misc/soulreaper_axe.png';
import ba_attacker from '@/public/img/misc/ba_attacker.webp';
import chinchompa from '@/public/img/misc/chinchompa.png';
import NumberInput from '@/app/components/generic/NumberInput';
import { RenderData } from '@/utils';
import { PlayerBase } from '@/types/Player';
import { StaticImageData } from 'next/image';
import { usePlayer } from '@/state/LoadoutStore';
import { ConditionalKeys } from 'type-fest';
import Toggle from '../generic/Toggle';

interface IBuffRenderData {
  name: string;
  image: StaticImageData;
  hint?: string;
  min?: number;
  max?: number;
}

const BuffRenderData: Partial<RenderData<keyof PlayerBase['buffs'], IBuffRenderData>> = {
  onSlayerTask: {
    name: 'On Slayer task',
    image: slayer,
    hint: 'Black mask and slayer helmet give bonuses while you are on a Slayer task.',
  },
  inWilderness: {
    name: 'In the Wilderness',
    image: skull,
    hint: 'Some weapons give bonuses while you are in the Wilderness.',
  },
  forinthrySurge: {
    name: 'Forinthry Surge',
    image: forinthry_surge,
    hint: 'Provides a bonus against revenants.',
  },
  kandarinDiary: {
    name: 'Kandarin Hard Diary',
    image: diary,
    hint: '10% activation chance increase to enchanted bolts.',
  },
  soulreaperStacks: {
    name: 'Soulreaper Stacks',
    image: soulreaper_axe,
    hint: 'When using the soulreaper axe, every hit gives a soul stack.',
  },
  baAttackerLevel: {
    name: 'Barbarian Assault Attacker Level',
    image: ba_attacker,
    hint: 'When fighting Penance Fighters and Penance Archers, your attacker level provides extra damage.',
  },
  chinchompaDistance: {
    name: 'Chinchompa Distance (tiles)',
    image: chinchompa,
    hint: 'When using chinchompas, accuracy is modified based on distance to the target.',
  },
};

const BuffToggle: React.FC<{ buff: ConditionalKeys<PlayerBase['buffs'], boolean> }> = observer(({ buff }) => {
  const { basePlayer, updateBasePlayer } = usePlayer();

  const renderData = BuffRenderData[buff];
  if (!renderData) {
    throw new Error(`Missing render data for ${buff}`);
  }
  const { name, image, hint } = renderData;

  return (
    <Toggle
      checked={basePlayer.buffs[buff]}
      setChecked={(c) => updateBasePlayer({ buffs: { [buff]: c } })}
      label={(
        <>
          <img src={image.src} width={18} className="inline-block" alt="" />
          {' '}
          {name}
          {' '}
          {hint && (
            <span
              className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
              data-tooltip-id="tooltip"
              data-tooltip-content={hint}
            >
              ?
            </span>
          )}
        </>
      )}
    />
  );
});

const BuffInput: React.FC<{ buff: ConditionalKeys<PlayerBase['buffs'], number> }> = observer(({ buff }) => {
  const { basePlayer, updateBasePlayer } = usePlayer();

  const renderData = BuffRenderData[buff];
  if (!renderData) {
    throw new Error(`Missing render data for ${buff}`);
  }
  const {
    name, image, hint, min, max,
  } = renderData;

  return (
    <div className="w-full">
      <NumberInput
        className="form-control w-12"
        required
        min={min}
        max={max}
        value={basePlayer.buffs[buff]}
        onChange={(v) => updateBasePlayer({ buffs: { [buff]: v } })}
      />
      <span className="ml-1 text-sm select-none">
        <img src={image.src} className="inline-block h-fit max-w-[18px]" alt="" />
        {' '}
        {name}
        {' '}
        {hint && (
          <span
            className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
            data-tooltip-id="tooltip"
            data-tooltip-content={hint}
          >
            ?
          </span>
        )}
      </span>
    </div>
  );
});

const ExtraOptions: React.FC = observer(() => (
  <div className="px-6 my-4">
    <div className="mt-2 mb-4">
      <BuffToggle buff="onSlayerTask" />
      <BuffToggle buff="inWilderness" />
      <BuffToggle buff="forinthrySurge" />
      <BuffToggle buff="kandarinDiary" />
      <BuffInput buff="soulreaperStacks" />
      <BuffInput buff="baAttackerLevel" />
      <BuffInput buff="chinchompaDistance" />
    </div>
  </div>
));

export default ExtraOptions;
