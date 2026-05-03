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
import { MonsterInputs } from '@/types/Monster';
import { ConditionalKeys } from 'type-fest';

interface IDefensiveReductionRenderData {
  label: string;
  image: StaticImageData;
}

const DefensiveReductionRenderData: { [k in keyof MonsterInputs['defenceReductions']]: IDefensiveReductionRenderData } = {
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
  key: Extract<ConditionalKeys<MonsterInputs['defenceReductions'], number>, keyof typeof DefensiveReductionRenderData>;
}

const DefensiveReductionInput: React.FC<DefensiveReductionInputProps> = observer(({ key }) => {
  const {
    inputs,
    updateInputs,
  } = useMonster();
  const {
    image,
    label,
  } = DefensiveReductionRenderData[key];

  return (
    <div className="w-full">
      <NumberInput
        className="form-control w-1/6"
        required
        min={0}
        value={inputs.defenceReductions[key]}
        onChange={(v) => updateInputs({ defenceReductions: { [key]: v } })}
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
  key: Extract<ConditionalKeys<MonsterInputs['defenceReductions'], boolean>, keyof typeof DefensiveReductionRenderData>;
}

export const DefensiveReductionToggle: React.FC<DefensiveReductionToggleProps> = observer(({ key }) => {
  const {
    inputs,
    updateInputs,
  } = useMonster();
  const {
    image,
    label,
  } = DefensiveReductionRenderData[key];

  return (
    <Toggle
      className="mt-1"
      checked={inputs.defenceReductions[key]}
      setChecked={(c) => updateInputs({ defenceReductions: { [key]: c } })}
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
    <DefensiveReductionInput key="elderMaul" />
    <DefensiveReductionInput key="dwh" />
    <DefensiveReductionInput key="arclight" />
    <DefensiveReductionInput key="emberlight" />
    <DefensiveReductionInput key="tonalztic" />
    <DefensiveReductionInput key="bgs" />
    <DefensiveReductionInput key="seercull" />
    <DefensiveReductionInput key="ayak" />
    <DefensiveReductionToggle key="accursed" />
    <DefensiveReductionToggle key="vulnerability" />
  </div>
));

export default MonsterDefensiveReductions;
