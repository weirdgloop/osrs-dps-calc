import React from 'react';
import { observer } from 'mobx-react-lite';
import type { StaticImageData } from 'next/image';
import NumberInput from '@/app/components/generic/NumberInput';
import { useMonster } from '@/state/MonsterStore';

export type CountedReduction = 'elderMaul' | 'dwh' | 'arclight' | 'emberlight' | 'tonalztic' | 'bgs' | 'seercull' | 'ayak';

interface DefenceReductionInputProps {
  reduction: CountedReduction;
  icon: StaticImageData;
  label: string;
}

const DefenceReductionInput: React.FC<DefenceReductionInputProps> = observer(({ reduction, icon, label }) => {
  const monster = useMonster();

  return (
    <div className="w-full">
      <NumberInput
        className="form-control w-1/6"
        required
        min={0}
        value={monster.inputs.defenceReductions[reduction]}
        onChange={(v) => monster.updateInputs({ defenceReductions: { [reduction]: v } })}
      />
      <span className="pl-2">
        <img src={icon.src} width={18} className="inline-block" alt="" />
        {' '}
        {label}
      </span>
    </div>
  );
});

export default DefenceReductionInput;
