import React from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
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
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';

const DefensiveReductions: React.FC = observer(() => {
  const store = useStore();
  const { isDefensiveReductionsExpanded } = store.ui;
  const { defenceReductions } = store.monster.inputs;

  return (
    <div className="rounded bg-body-100 dark:bg-dark-500">
      <button
        type="button"
        className={`w-full pt-1 border-b-body-400 dark:border-b-dark-300 px-2 flex text-gray-500 dark:text-gray-300 font-semibold justify-between gap-2 ${isDefensiveReductionsExpanded ? 'border-b' : ''}`}
        onClick={() => store.updateUIState({ isDefensiveReductionsExpanded: !isDefensiveReductionsExpanded })}
      >
        <div>
          Defensive Reductions
        </div>
        <div className="relative top-[-2px]">
          {isDefensiveReductionsExpanded ? <IconChevronUp width={20} />
            : <IconChevronDown width={20} />}
        </div>
      </button>

      {isDefensiveReductionsExpanded && (
        <div className="p-2">
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.elderMaul}
              onChange={(v) => store.updateMonster({ inputs: { defenceReductions: { elderMaul: v } } })}
            />
            <span className="pl-2">
              <img src={elderMaul.src} width={18} className="inline-block" alt="" />
              {' '}
              Elder maul hits
            </span>
          </div>
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.dwh}
              onChange={(v) => store.updateMonster({ inputs: { defenceReductions: { dwh: v } } })}
            />
            <span className="pl-2">
              <img src={dwh.src} width={18} className="inline-block" alt="" />
              {' '}
              Dragon warhammer hits
            </span>
          </div>
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.arclight}
              onChange={(v) => store.updateMonster({ inputs: { defenceReductions: { arclight: v } } })}
            />
            <span className="pl-2">
              <img src={arc.src} width={18} className="inline-block" alt="" />
              {' '}
              Arclight hits
            </span>
          </div>
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.emberlight}
              onChange={(v) => store.updateMonster({ inputs: { defenceReductions: { emberlight: v } } })}
            />
            <span className="pl-2">
              <img src={emberlight.src} width={18} className="inline-block" alt="" />
              {' '}
              Emberlight hits
            </span>
          </div>
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.tonalztic}
              onChange={(v) => store.updateMonster({ inputs: { defenceReductions: { tonalztic: v } } })}
            />
            <span className="pl-2">
              <img src={tonalztic.src} width={18} className="inline-block" alt="" />
              {' '}
              Tonalztics of ralos&apos; hits
            </span>
          </div>
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.bgs}
              onChange={(v) => store.updateMonster({ inputs: { defenceReductions: { bgs: v } } })}
            />
            <span className="pl-2">
              <img src={bgs.src} width={18} className="inline-block" alt="" />
              {' '}
              Bandos godsword damage
            </span>
          </div>
          <Toggle
            className="mt-1"
            checked={defenceReductions.accursed}
            setChecked={(c) => store.updateMonster({ inputs: { defenceReductions: { accursed: c } } })}
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
            setChecked={(c) => store.updateMonster({ inputs: { defenceReductions: { vulnerability: c } } })}
            label={(
              <>
                <img src={vuln.src} width={18} className="inline-block" alt="" />
                {' '}
                Vulnerability
              </>
            )}
          />
        </div>
      )}
    </div>
  );
});

export default DefensiveReductions;
