import React, { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import NumberInput from '@/app/components/generic/NumberInput';
import Toggle from '@/app/components/generic/Toggle';
import vuln from '@/public/img/def_reductions/Vulnerability.png';
import bgs from '@/public/img/def_reductions/Bandos_godsword.webp';
import sceptre from '@/public/img/def_reductions/Accursed sceptre.png';
import dwh from '@/public/img/def_reductions/Dragon_warhammer.webp';
import arc from '@/public/img/def_reductions/Arclight.png';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';

const DefensiveReductions: React.FC = observer(() => {
  const store = useStore();
  const { defenceReductions } = store.monster;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded bg-body-100 dark:bg-dark-500">
      <button
        type="button"
        className={`w-full pt-1 border-b-body-400 dark:border-b-dark-300 px-2 flex text-gray-500 dark:text-gray-300 font-semibold justify-between gap-2 ${expanded ? 'border-b' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          Defensive Reductions
        </div>
        <div className="relative top-[-2px]">
          {expanded ? <IconChevronUp width={20} />
            : <IconChevronDown width={20} />}
        </div>
      </button>

      {expanded && (
        <div className="p-2">
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.dwh}
              onChange={(v) => store.updateMonster({ defenceReductions: { dwh: v } })}
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
              value={defenceReductions.bgs}
              onChange={(v) => store.updateMonster({ defenceReductions: { bgs: v } })}
            />
            <span className="pl-2">
              <img src={bgs.src} width={18} className="inline-block" alt="" />
              {' '}
              Bandos godsword damage
            </span>
          </div>
          <div className="w-full">
            <NumberInput
              className="form-control w-1/6"
              required
              min={0}
              value={defenceReductions.arclight}
              onChange={(v) => store.updateMonster({ defenceReductions: { arclight: v } })}
            />
            <span className="pl-2">
              <img src={arc.src} width={18} className="inline-block" alt="" />
              {' '}
              Arclight hits
            </span>
          </div>
          <Toggle
            className="mt-1"
            checked={defenceReductions.accursed}
            setChecked={(c) => store.updateMonster({ defenceReductions: { accursed: c } })}
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
            setChecked={(c) => store.updateMonster({ defenceReductions: { vulnerability: c } })}
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
