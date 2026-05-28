import React from 'react';
import NumberInput from '@/app/components/generic/NumberInput';
import Toggle from '@/app/components/generic/Toggle';
import vuln from '@/public/img/def_reductions/Vulnerability.png';
import bgs from '@/public/img/def_reductions/Bandos_godsword.webp';
import sceptre from '@/public/img/def_reductions/Accursed sceptre.png';
import elderMaul from '@/public/img/def_reductions/Elder_maul.png';
import tonalztic from '@/public/img/def_reductions/Tonalztics_of_ralos.png';
import dwh from '@/public/img/def_reductions/Dragon_warhammer.webp';
import arc from '@/public/img/def_reductions/Arclight.png';
import emberlight from '@/public/img/def_reductions/Emberlight.png';
import seercull from '@/public/img/def_reductions/Seercull.png';
import ayak from '@/public/img/def_reductions/Eye_of_ayak.png';
import { observer } from 'mobx-react-lite';
import { useMonster } from '@/state/MonsterStore';
import { StaticImageData } from 'next/image';
import { ConditionalKeys } from 'type-fest';
import { RenderData } from '@/utils';
import { MonsterInputs } from '@/types/Monster';

interface IDefensiveReductionRenderData {
  label: string;
  image: StaticImageData;
}

const DefensiveReductionRenderData: RenderData<keyof MonsterInputs['defenceReductions'], IDefensiveReductionRenderData> = {
  elderMaul: {
    label: 'Elder maul hits',
    image: elderMaul,
  },
  dwh: {
    label: 'Dragon warhammer hits',
    image: dwh,
  },
  arclight: {
    label: 'Arclight hits',
    image: arc,
  },
  emberlight: {
    label: 'Emberlight hits',
    image: emberlight,
  },
  tonalztic: {
    label: 'Tonalztics of ralos hits',
    image: tonalztic,
  },
  bgs: {
    label: 'Bandos godsword damage',
    image: bgs,
  },
  seercull: {
    label: 'Seercull damage',
    image: seercull,
  },
  ayak: {
    label: 'Eye of ayak damage',
    image: ayak,
  },
  accursed: {
    label: 'Accursed sceptre',
    image: sceptre,
  },
  vulnerability: {
    label: 'Vulnerability',
    image: vuln,
  },
};

const DefenceFloorBanner: React.FC = observer(() => {
  const { defenceFloor } = useMonster();

  if (defenceFloor === 0) {
    return null;
  }

  return (
    <p className="text-xs mb-2 text-gray-300">
      Defence floor:
      {' '}
      {defenceFloor}
    </p>
  );
});

export interface DefensiveReductionInputProps {
  reduction: Extract<ConditionalKeys<MonsterInputs['defenceReductions'], number>, keyof typeof DefensiveReductionRenderData>;
}

const DefensiveReductionInput: React.FC<DefensiveReductionInputProps> = observer(({ reduction }) => {
  const {
    monsterBase,
    updateMonsterBase,
  } = useMonster();
  const {
    image,
    label,
  } = DefensiveReductionRenderData[reduction];

  return (
    <div className="w-full">
      <NumberInput
        className="form-control w-1/6"
        required
        min={0}
        value={monsterBase.inputs.defenceReductions[reduction]}
        onChange={(v) => updateMonsterBase({ inputs: { defenceReductions: { [reduction]: v } } })}
      />
      <span className="pl-2">
        <img src={image.src} width={18} className="inline-block" alt="" />
        {' '}
        {label}
      </span>
    </div>
  );
});

export interface DefensiveReductionToggleProps {
  reduction: Extract<ConditionalKeys<MonsterInputs['defenceReductions'], boolean>, keyof typeof DefensiveReductionRenderData>;
}

export const DefensiveReductionToggle: React.FC<DefensiveReductionToggleProps> = observer(({ reduction }) => {
  const {
    monsterBase,
    updateMonsterBase,
  } = useMonster();
  const {
    image,
    label,
  } = DefensiveReductionRenderData[reduction];

  return (
    <Toggle
      className="mt-1"
      checked={monsterBase.inputs.defenceReductions[reduction]}
      setChecked={(c) => updateMonsterBase({ inputs: { defenceReductions: { [reduction]: c } } })}
      label={(
        <>
          <img src={image.src} width={18} className="inline-block" alt="" />
          {' '}
          {label}
        </>
      )}
    />
  );
});

const MonsterDefensiveReductions: React.FC = observer(() => (
  <div className="p-2">
    <DefenceFloorBanner />
    <DefensiveReductionInput reduction="elderMaul" />
    <DefensiveReductionInput reduction="dwh" />
    <DefensiveReductionInput reduction="arclight" />
    <DefensiveReductionInput reduction="emberlight" />
    <DefensiveReductionInput reduction="tonalztic" />
    <DefensiveReductionInput reduction="bgs" />
    <DefensiveReductionInput reduction="seercull" />
    <DefensiveReductionInput reduction="ayak" />
    <DefensiveReductionToggle reduction="accursed" />
    <DefensiveReductionToggle reduction="vulnerability" />
  </div>
));

export default MonsterDefensiveReductions;
