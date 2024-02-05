import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import Select from '@/app/components/generic/Select';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { Player, PlayerSkills } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { toJS } from 'mobx';
import { useTheme } from 'next-themes';
import { max } from 'd3-array';
import { keys } from '@/utils';
import equipmentStats from '@/public/img/Equipment Stats.png';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { scaleMonsterHpOnly, scaleMonster } from '@/lib/MonsterScaling';
import { CalcOpts } from '@/lib/BaseCalc';

enum XAxisType {
  MONSTER_DEF,
  MONSTER_MAGIC,
  MONSTER_HP,
  PLAYER_ATTACK_LEVEL,
  PLAYER_STRENGTH_LEVEL,
  PLAYER_RANGED_LEVEL,
  PLAYER_MAGIC_LEVEL,
  STAT_DECAY_RESTORE,
  PLAYER_DEFENCE_LEVEL,
}

enum YAxisType {
  // TTK,
  PLAYER_DPS,
  PLAYER_EXPECTED_HIT,
  MONSTER_DPS,
  DAMAGE_TAKEN,
}

const XAxisOptions = [
  { label: 'Monster defence level', axisLabel: 'Level', value: XAxisType.MONSTER_DEF },
  { label: 'Monster magic level', axisLabel: 'Level', value: XAxisType.MONSTER_MAGIC },
  { label: 'Monster HP', axisLabel: 'Hitpoints', value: XAxisType.MONSTER_HP },
  { label: 'Player attack level', axisLabel: 'Level', value: XAxisType.PLAYER_ATTACK_LEVEL },
  { label: 'Player strength level', axisLabel: 'Level', value: XAxisType.PLAYER_STRENGTH_LEVEL },
  { label: 'Player defence level', axisLabel: 'Level', value: XAxisType.PLAYER_DEFENCE_LEVEL },
  { label: 'Player ranged level', axisLabel: 'Level', value: XAxisType.PLAYER_RANGED_LEVEL },
  { label: 'Player magic level', axisLabel: 'Level', value: XAxisType.PLAYER_MAGIC_LEVEL },
  { label: 'Player stat decay', axisLabel: 'Minutes after boost', value: XAxisType.STAT_DECAY_RESTORE },
];

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2">
        <div>
          <p>
            <strong>
              {label}
            </strong>
          </p>
          {
            payload.map((p) => (
              <div key={p.name} className="flex justify-between w-40 gap-2">
                <div className="flex items-center gap-1 leading-3 overflow-hidden">
                  <div>
                    <div
                      className="w-3 h-3 inline-block border border-gray-400 rounded-lg"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
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
  const scaledMonster: Monster = scaleMonster(baseMonster);
  switch (xAxisType) {
    case XAxisType.MONSTER_DEF:
      for (let newDef = scaledMonster.skills.def; newDef >= 0; newDef--) {
        yield {
          xValue: newDef,
          loadouts,
          monster: {
            ...scaledMonster,
            skills: {
              ...scaledMonster.skills,
              def: newDef,
            },
          },
        };
      }
      return;

    case XAxisType.MONSTER_MAGIC:
      for (let newMagic = scaledMonster.skills.magic; newMagic >= 0; newMagic--) {
        yield {
          xValue: newMagic,
          loadouts,
          monster: {
            ...scaledMonster,
            skills: {
              ...scaledMonster.skills,
              magic: newMagic,
            },
          },
        };
      }
      return;

    case XAxisType.MONSTER_HP: {
      for (let newHp = scaledMonster.skills.hp; newHp >= 0; newHp--) {
        const m: Monster = {
          ...scaledMonster,
          inputs: {
            ...scaledMonster.inputs,
            monsterCurrentHp: newHp,
          },
        };
        yield {
          xValue: newHp,
          loadouts,
          monster: scaleMonsterHpOnly(m),
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
          monster: scaledMonster,
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
          monster: scaledMonster,
        };
      }
      return;

    case XAxisType.PLAYER_DEFENCE_LEVEL:
      for (let newDefence = 0; newDefence <= 125; newDefence++) {
        yield {
          xValue: newDefence,
          loadouts: loadouts.map((l) => ({
            ...l,
            skills: {
              ...l.skills,
              def: newDefence,
            },
          })),
          monster: scaledMonster,
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
          monster: scaledMonster,
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
          monster: scaledMonster,
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
          monster: scaledMonster,
        };
      }
      return;
    }

    default:
      throw new Error(`unimplemented xAxisType ${xAxisType}`);
  }
}

interface Annotation {
  label: string,
  xValue: number,
}
const getAnnotations = (xAxisType: XAxisType, monster: Monster): Annotation[] => {
  if (xAxisType === XAxisType.MONSTER_DEF) {
    const annotations: Annotation[] = [];
    let currentDef = monster.skills.def;
    let dwhCount = 1;
    while (currentDef >= 100) {
      currentDef -= Math.trunc(currentDef * 3 / 10);
      annotations.push({
        label: `DWH x${dwhCount}`,
        xValue: currentDef,
      });
      dwhCount += 1;
    }

    return annotations;
  }

  return [];
};

const getOutput = (
  yAxisType: YAxisType,
  loadout: Player,
  monster: Monster,
): number => {
  const opts: Partial<CalcOpts> = {
    // we explicitly handle this in getInputs
    disableMonsterScaling: true,
  };
  switch (yAxisType) {
    case YAxisType.PLAYER_DPS:
      return new PlayerVsNPCCalc(loadout, monster, opts).getDps();
    case YAxisType.PLAYER_EXPECTED_HIT:
      return new PlayerVsNPCCalc(loadout, monster, opts).getDistribution().getExpectedDamage();
    case YAxisType.MONSTER_DPS:
      return new NPCVsPlayerCalc(loadout, monster, opts).getDps();
    case YAxisType.DAMAGE_TAKEN: {
      return new NPCVsPlayerCalc(loadout, monster, opts).getAverageDamageTaken();
    }

    default:
      throw new Error(`Unimplemented yAxisType ${yAxisType}`);
  }
};

const LoadoutComparison: React.FC = observer(() => {
  const store = useStore();
  const { monster } = store;
  const { showLoadoutComparison } = store.prefs;
  const loadouts = toJS(store.loadouts);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const YAxisOptions = useMemo(() => {
    const opts = [
      { label: 'Player damage-per-second', axisLabel: 'DPS', value: YAxisType.PLAYER_DPS },
      { label: 'Player expected hit', axisLabel: 'Hit', value: YAxisType.PLAYER_EXPECTED_HIT },
      // {label: 'Time-to-kill', value: YAxisType.TTK},
      // {label: 'Damage taken', value: YAxisType.DAMAGE_TAKEN}
    ];

    if (!store.isNonStandardMonster) {
      opts.push(
        { label: 'Player damage taken per sec', axisLabel: 'DPS', value: YAxisType.MONSTER_DPS },
        { label: 'Player damage taken per kill', axisLabel: 'Damage', value: YAxisType.DAMAGE_TAKEN },
      );
    }

    return opts;
  }, [store.isNonStandardMonster]);

  const [xAxisType, setXAxisType] = useState<{ label: string, axisLabel?: string, value: XAxisType } | null | undefined>(XAxisOptions[0]);
  const [yAxisType, setYAxisType] = useState<{ label: string, axisLabel?: string, value: YAxisType } | null | undefined>(YAxisOptions[0]);

  useEffect(() => {
    // If the list of Y axis options changes, and the option we have selected no longer exists, reset to the first one
    if (!YAxisOptions.find((opt) => opt.value === yAxisType?.value)) {
      setYAxisType(YAxisOptions[0]);
    }
  }, [YAxisOptions, yAxisType?.value]);

  const data = useMemo(() => {
    const x = xAxisType?.value;
    const y = yAxisType?.value;
    if (!showLoadoutComparison || (x === undefined || y === undefined)) {
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
      for (const [, l] of input.loadouts.entries()) {
        const v = getOutput(y, l, input.monster);
        entry[l.name] = v.toFixed(2);
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
  }, [xAxisType, yAxisType, monster, loadouts, showLoadoutComparison]);

  const [tickCount, domainMax] = useMemo(() => {
    const highest = data.max;
    const stepsize = 10 ** Math.floor(Math.log10(highest) - 1);
    const ceilHighest = Math.ceil(1 / stepsize * highest) * stepsize - 1 / 1e9;
    const count = 1 + Math.ceil(1 / stepsize * highest);
    return [count, ceilHighest];
  }, [data]);

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
        dataKey={loadouts[i].name}
        stroke={colour}
        dot={false}
        isAnimationActive={false}
      />);
      strokeColours.push(colour);
    }
    return lines;
  }, [loadouts, isDark]);

  const generateAnnotations = useCallback((): React.ReactNode[] => {
    if (!xAxisType) {
      return [];
    }

    const annotations: React.ReactNode[] = [];
    getAnnotations(xAxisType.value, monster).forEach((a) => {
      annotations.push(
        // ReferenceLine throws a warning: Support for defaultProps will be removed ...
        // this is known: https://github.com/recharts/recharts/issues/3615#issuecomment-1865558694
        <ReferenceLine
          key={a.label}
          label={{
            value: a.label, angle: 90, fontSize: 12, fill: isDark ? 'white' : 'black',
          }}
          x={a.xValue}
          stroke="red"
          strokeDasharray="6 6"
        />,
      );
    });

    return annotations;
  }, [xAxisType, monster, isDark]);

  return (
    <SectionAccordion
      defaultIsOpen={showLoadoutComparison}
      onIsOpenChanged={(o) => store.updatePreferences({ showLoadoutComparison: o })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={equipmentStats.src} /></div>
          <h3 className="font-serif font-bold">
            Loadout Comparison Graph
          </h3>
        </div>
      )}
    >
      {data && (
        <div className="px-6 py-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={data.lines}
              margin={{ top: 40, right: 20 }}
            >
              <XAxis
                allowDecimals
                dataKey="name"
                stroke="#777777"
                interval="equidistantPreserveStart"
                label={{ value: xAxisType?.axisLabel, position: 'insideBottom', offset: -15 }}
              />
              <YAxis
                stroke="#777777"
                domain={[0, domainMax]}
                tickCount={tickCount}
                tickFormatter={(v: number) => `${parseFloat(v.toFixed(2))}`}
                interval="equidistantPreserveStart"
                label={{
                  value: yAxisType?.axisLabel, position: 'insideLeft', angle: -90, style: { textAnchor: 'middle' },
                }}
              />
              <CartesianGrid stroke="gray" strokeDasharray="5 5" />
              <Tooltip
                content={(props) => <CustomTooltip {...props} />}
              />
              <Legend wrapperStyle={{ fontSize: '.9em', top: 0 }} />
              {generateLines()}
              {generateAnnotations()}
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
        </div>
      )}
    </SectionAccordion>
  );
});

export default LoadoutComparison;
