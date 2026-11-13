import React from 'react';
import { observer } from 'mobx-react-lite';
import Toggle from '@/app/components/generic/Toggle';
import MonsterAccordion from '@/app/components/monster/MonsterAccordion';
import DefenceFloor from '@/app/components/monster/reductions/DefenceFloor';
import DefenceReductionInput, { CountedReduction } from '@/app/components/monster/reductions/DefenceReductionInput';
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
import { useMonster } from '@/state/MonsterStore';
import { useUI } from '@/state/UIStore';

const COUNTED_REDUCTIONS: { reduction: CountedReduction, icon: typeof dwh, label: string }[] = [
  { reduction: 'elderMaul', icon: elderMaul, label: 'Elder maul hits' },
  { reduction: 'dwh', icon: dwh, label: 'Dragon warhammer hits' },
  { reduction: 'arclight', icon: arc, label: 'Arclight hits' },
  { reduction: 'emberlight', icon: emberlight, label: 'Emberlight hits' },
  { reduction: 'tonalztic', icon: tonalztic, label: 'Tonalztics of Ralos\' hits' },
  { reduction: 'bgs', icon: bgs, label: 'Bandos godsword damage' },
  { reduction: 'seercull', icon: seercull, label: 'Seercull damage' },
  { reduction: 'ayak', icon: ayak, label: 'Eye of ayak damage' },
];

const DefensiveReductions: React.FC = observer(() => {
  const monster = useMonster();
  const ui = useUI();
  const { defenceReductions } = monster.inputs;

  return (
    <MonsterAccordion
      title="Defensive Reductions"
      isOpen={ui.isDefensiveReductionsExpanded}
      onToggle={() => ui.update({ isDefensiveReductionsExpanded: !ui.isDefensiveReductionsExpanded })}
    >
      <div className="p-2">
        <DefenceFloor />
        {COUNTED_REDUCTIONS.map(({ reduction, icon, label }) => (
          <DefenceReductionInput key={reduction} reduction={reduction} icon={icon} label={label} />
        ))}
        <Toggle
          className="mt-1"
          checked={defenceReductions.accursed}
          setChecked={(accursed) => monster.updateInputs({ defenceReductions: { accursed } })}
          label={(
            <>
              <img src={sceptre.src} width={18} className="inline-block" alt="" />
              {' '}
              Accursed sceptre
            </>
          )}
        />
        <Toggle
          checked={defenceReductions.vulnerability}
          setChecked={(vulnerability) => monster.updateInputs({ defenceReductions: { vulnerability } })}
          label={(
            <>
              <img src={vuln.src} width={18} className="inline-block" alt="" />
              {' '}
              Vulnerability
            </>
          )}
        />
      </div>
    </MonsterAccordion>
  );
});

export default DefensiveReductions;
