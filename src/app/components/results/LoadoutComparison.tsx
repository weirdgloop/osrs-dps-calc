import React, { useCallback, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import Select from '@/app/components/generic/Select';
import CombatCalc from '@/lib/CombatCalc';
import { Player, PlayerSkills } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { toJS } from 'mobx';
import { useTheme } from 'next-themes';
import { max } from 'd3-array';
import { keys } from '@/utils';
import { scaledMonster } from '@/lib/MonsterScaling';

enum XAxisType {
  MONSTER_DEF,
  MONSTER_MAGIC,
  MONSTER_HP,
  PLAYER_ATTACK_LEVEL,
  PLAYER_STRENGTH_LEVEL,
  PLAYER_RANGED_LEVEL,
  PLAYER_MAGIC_LEVEL,
  STAT_DECAY_RESTORE,
}

enum YAxisType {
  // TTK,
  DPS,
  EXPECTED_HIT,
  // DAMAGE_TAKEN
}

const XAxisOptions = [
  { label: 'Monster defence level', value: XAxisType.MONSTER_DEF },
  { label: 'Monster magic level', value: XAxisType.MONSTER_MAGIC },
  { label: 'Monster HP', value: XAxisType.MONSTER_HP },
  { label: 'Player attack level', value: XAxisType.PLAYER_ATTACK_LEVEL },
  { label: 'Player strength level', value: XAxisType.PLAYER_STRENGTH_LEVEL },
  { label: 'Player ranged level', value: XAxisType.PLAYER_RANGED_LEVEL },
  { label: 'Player magic level', value: XAxisType.PLAYER_MAGIC_LEVEL },
  { label: 'Player stat decay', value: XAxisType.STAT_DECAY_RESTORE },
];

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2">
        <div>
          <p>
            <strong>
              Level
              {label}
            </strong>
          </p>
          {
            payload.map((p) => (
              <div key={p.name} className="flex justify-between w-32">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 inline-block border border-gray-400 rounded-lg" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
                <span className="text-gray-400 font-bold">{p.value}</span>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  return null;
};

function* inputRange(
  xAxisType: XAxisType,
  loadouts: Player[],
  baseMonster: Monster,
): Generator<{
    xValue: number,
    loadouts: Player[],
    monster: Monster,
  }> {
  switch (xAxisType) {
    case XAxisType.MONSTER_DEF:
      for (let newDef = baseMonster.skills.def; newDef >= 0; newDef--) {
        yield {
          xValue: newDef,
          loadouts,
          monster: {
            ...baseMonster,
            skills: {
              ...baseMonster.skills,
              def: newDef,
            },
          },
        };
      }
      return;

    case XAxisType.MONSTER_MAGIC:
      for (let newMagic = baseMonster.skills.magic; newMagic >= 0; newMagic--) {
        yield {
          xValue: newMagic,
          loadouts,
          monster: {
            ...baseMonster,
            skills: {
              ...baseMonster.skills,
              magic: newMagic,
            },
          },
        };
      }
      return;

    case XAxisType.MONSTER_HP: {
      const shouldScale = loadouts.some((l) => CombatCalc.distIsCurrentHpDependent(l, baseMonster));
      for (let newHp = baseMonster.skills.hp; newHp >= 0; newHp--) {
        const m: Monster = {
          ...baseMonster,
          monsterCurrentHp: newHp,
        };
        yield {
          xValue: newHp,
          loadouts,
          monster: shouldScale ? scaledMonster(m) : m,
        };
      }
      return;
    }

    case XAxisType.PLAYER_ATTACK_LEVEL:
      for (let newAttack = 0; newAttack <= 125; newAttack++) {
        yield {
          xValue: newAttack,
          loadouts: loadouts.map((l) => ({
            ...l,
            skills: {
              ...l.skills,
              atk: newAttack,
            },
          })),
          monster: baseMonster,
        };
      }
      return;

    case XAxisType.PLAYER_STRENGTH_LEVEL:
      for (let newStrength = 0; newStrength <= 125; newStrength++) {
        yield {
          xValue: newStrength,
          loadouts: loadouts.map((l) => ({
            ...l,
            skills: {
              ...l.skills,
              str: newStrength,
            },
          })),
          monster: baseMonster,
        };
      }
      return;

    case XAxisType.PLAYER_RANGED_LEVEL:
      for (let newRanged = 0; newRanged <= 125; newRanged++) {
        yield {
          xValue: newRanged,
          loadouts: loadouts.map((l) => ({
            ...l,
            skills: {
              ...l.skills,
              ranged: newRanged,
            },
          })),
          monster: baseMonster,
        };
      }
      return;

    case XAxisType.PLAYER_MAGIC_LEVEL:
      for (let newMagic = 0; newMagic <= 125; newMagic++) {
        yield {
          xValue: newMagic,
          loadouts: loadouts.map((l) => ({
            ...l,
            skills: {
              ...l.skills,
              magic: newMagic,
            },
          })),
          monster: baseMonster,
        };
      }
      return;

    case XAxisType.STAT_DECAY_RESTORE: {
      const limit = max(loadouts, (l) => max(keys(l.boosts) as (keyof PlayerSkills)[], (k) => Math.abs(l.boosts[k]))) || 0;
      for (let restore = 0; restore <= limit; restore++) {
        yield {
          xValue: restore,
          loadouts: loadouts.map((l) => {
            const newBoosts: PlayerSkills = { ...l.boosts };
            keys(newBoosts).forEach((k) => {
              const v = newBoosts[k];
              newBoosts[k] = Math.sign(v) * (Math.abs(v) - restore);
            });

            return {
              ...l,
              boosts: newBoosts,
            };
          }),
          monster: baseMonster,
        };
      }
      return;
    }

    default:
      throw new Error(`unimplemented xAxisType ${xAxisType}`);
  }
}

const YAxisOptions = [
  { label: 'Player damage-per-second', value: YAxisType.DPS },
  { label: 'Expected hit', value: YAxisType.EXPECTED_HIT },
  // {label: 'Time-to-kill', value: YAxisType.TTK},
  // {label: 'Damage taken', value: YAxisType.DAMAGE_TAKEN}
];

const getOutput = (
  yAxisType: YAxisType,
  loadout: Player,
  monster: Monster,
): number => {
  switch (yAxisType) {
    case YAxisType.DPS:
      return new CombatCalc(loadout, monster).getDps();
    case YAxisType.EXPECTED_HIT:
      return new CombatCalc(loadout, monster).getDistribution().getExpectedDamage();

    default:
      throw new Error(`Unimplemented yAxisType ${yAxisType}`);
  }
};

const LoadoutComparison: React.FC = observer(() => {
  const store = useStore();
  const loadouts = toJS(store.loadouts);
  const monster = toJS(store.monster);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [xAxisType, setXAxisType] = useState<{ label: string, value: XAxisType } | null | undefined>(XAxisOptions[0]);
  const [yAxisType, setYAxisType] = useState<{ label: string, value: YAxisType } | null | undefined>(YAxisOptions[0]);

  const data = useMemo(() => {
    const x = xAxisType?.value;
    const y = yAxisType?.value;
    if (x === undefined || y === undefined) {
      return {
        max: 1,
        min: 0,
        lines: [],
      };
    }

    let maximum = 0;
    let min = 100;
    const lines: { name: number, [lKey: string]: string | number }[] = [];
    for (const input of inputRange(x, loadouts, monster)) {
      const entry: typeof lines[0] = { name: input.xValue };
      for (const [i, l] of input.loadouts.entries()) {
        const v = getOutput(y, l, input.monster);
        entry[`Loadout ${i + 1}`] = v.toFixed(2);
        maximum = Math.max(maximum, v);
        min = Math.min(min, v);
      }
      lines.push(entry);
    }
    return {
      max: maximum === 0 ? 1 : Math.ceil(maximum),
      min: min === 100 ? 0 : Math.floor(min),
      lines,
    };
  }, [xAxisType, yAxisType, monster, loadouts]);

  const generateLines = useCallback(() => {
    const lines: React.ReactNode[] = [];

    const strokeColours = isDark
      ? ['cyan', 'yellow', 'lime', 'orange', 'pink']
      : ['blue', 'chocolate', 'green', 'sienna', 'purple'];
    for (let i = 0; i < loadouts.length; i++) {
      const colour = strokeColours.shift() || 'red';
      lines.push(<Line
        key={i}
        type="monotone"
        dataKey={`Loadout ${i + 1}`}
        stroke={colour}
        dot={false}
        isAnimationActive={false}
      />);
      strokeColours.push(colour);
    }
    return lines;
  }, [loadouts, isDark]);

  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data.lines}
        >
          <XAxis
            allowDecimals
            dataKey="name"
            stroke="#777777"
            interval="equidistantPreserveStart"
          />
          <YAxis
            stroke="#777777"
            domain={[data.min, data.max]}
            interval="equidistantPreserveStart"
          />
          <CartesianGrid stroke="gray" strokeDasharray="5 5" />
          <Tooltip
            content={(props) => <CustomTooltip {...props} />}
          />
          <Legend wrapperStyle={{ fontSize: '.9em' }} />
          {generateLines()}
        </LineChart>
      </ResponsiveContainer>
      <div className="my-4 flex flex-wrap md:flex-nowrap gap-4 max-w-lg m-auto dark:text-white">
        <div className="basis-full md:basis-1/2">
          <h3 className="font-serif font-bold mb-2">X axis</h3>
          <Select
            id="loadout-comparison-x"
            items={XAxisOptions}
            value={xAxisType || undefined}
            onSelectedItemChange={(i) => {
              setXAxisType(i);
            }}
          />
        </div>
        <div className="basis-full md:basis-1/2">
          <h3 className="font-serif font-bold mb-2">Y axis</h3>
          <Select
            id="loadout-comparison-y"
            items={YAxisOptions}
            value={yAxisType || undefined}
            onSelectedItemChange={(i) => {
              setYAxisType(i);
            }}
          />
        </div>
      </div>
    </>
  );
});

export default LoadoutComparison;
