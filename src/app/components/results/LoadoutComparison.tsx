import React, {useCallback, useMemo, useState} from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from 'recharts';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Select from "@/app/components/generic/Select";
import CombatCalc from "@/lib/CombatCalc";
import {Player, PlayerSkills} from "@/types/Player";
import {Monster} from "@/types/Monster";
import {NameType, ValueType} from "recharts/types/component/DefaultTooltipContent";
import {toJS} from "mobx";
import {useTheme} from "next-themes";
import {max} from "d3-array";
import {keys} from "@/utils";

enum XAxisType {
  MONSTER_DEF,
  MONSTER_MAGIC,
  PLAYER_ATTACK_LEVEL,
  PLAYER_STRENGTH_LEVEL,
  PLAYER_RANGED_LEVEL,
  PLAYER_MAGIC_LEVEL,
  STAT_DECAY_RESTORE,
}

enum YAxisType {
  // TTK,
  DPS,
  // DAMAGE_TAKEN
}

const XAxisOptions = [
  {label: 'Monster defence level', value: XAxisType.MONSTER_DEF},
  {label: 'Monster magic level', value: XAxisType.MONSTER_MAGIC},
  {label: 'Player attack level', value: XAxisType.PLAYER_ATTACK_LEVEL},
  {label: 'Player strength level', value: XAxisType.PLAYER_STRENGTH_LEVEL},
  {label: 'Player ranged level', value: XAxisType.PLAYER_RANGED_LEVEL},
  {label: 'Player magic level', value: XAxisType.PLAYER_MAGIC_LEVEL},
  {label: 'Player stat decay', value: XAxisType.STAT_DECAY_RESTORE},
]

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={'bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2'}>
        <div>
          <p>
            <strong>Level {label}</strong>
          </p>
          {
            payload.map((p) => {
              return <div key={p.name} className={'flex justify-between w-32'}>
                <div className={'flex items-center gap-1'}>
                  <span className={'w-3 h-3 inline-block border border-gray-400 rounded-lg'} style={{backgroundColor: p.color}} />
                  {p.name}
                </div>
                <span className={'text-gray-400 font-bold'}>{p.value}</span>
              </div>
            })
          }
        </div>
      </div>
    );
  }

  return null;
}

function* inputRange(
  xAxisType: XAxisType,
  loadouts: Player[],
    monster: Monster,
): Generator<{
  xValue: number,
  loadouts: Player[],
  monster: Monster,
}> {

  switch (xAxisType) {
    case XAxisType.MONSTER_DEF:
      for (let newDef = 0; newDef <= monster.skills.def; newDef++) {
        yield {
          xValue: newDef,
          loadouts: loadouts,
          monster: {
            ...monster,
            skills: {
              ...monster.skills,
              def: newDef,
            },
          },
        };
      }
      return;

    case XAxisType.MONSTER_MAGIC:
      for (let newMagic = 0; newMagic <= monster.skills.magic; newMagic++) {
        yield {
          xValue: newMagic,
          loadouts: loadouts,
          monster: {
            ...monster,
            skills: {
              ...monster.skills,
              magic: newMagic,
            },
          },
        };
      }
      return;

    case XAxisType.PLAYER_ATTACK_LEVEL:
      for (let newAttack = 0; newAttack <= 125; newAttack++) {
        yield {
          xValue: newAttack,
          loadouts: loadouts.map(l => ({
            ...l,
            skills: {
              ...l.skills,
              atk: newAttack,
            },
          })),
          monster: monster,
        };
      }
      return;

    case XAxisType.PLAYER_STRENGTH_LEVEL:
      for (let newStrength = 0; newStrength <= 125; newStrength++) {
        yield {
          xValue: newStrength,
          loadouts: loadouts.map(l => ({
            ...l,
            skills: {
              ...l.skills,
              str: newStrength,
            },
          })),
          monster: monster,
        };
      }
      return;

    case XAxisType.PLAYER_RANGED_LEVEL:
      for (let newRanged = 0; newRanged <= 125; newRanged++) {
        yield {
          xValue: newRanged,
          loadouts: loadouts.map(l => ({
            ...l,
            skills: {
              ...l.skills,
              ranged: newRanged,
            },
          })),
          monster: monster,
        };
      }
      return;

    case XAxisType.PLAYER_MAGIC_LEVEL:
      for (let newMagic = 0; newMagic <= 125; newMagic++) {
        yield {
          xValue: newMagic,
          loadouts: loadouts.map(l => ({
            ...l,
            skills: {
              ...l.skills,
              magic: newMagic,
            },
          })),
          monster: monster,
        };
      }
      return;

    case XAxisType.STAT_DECAY_RESTORE:
      const limit = max(loadouts, l => max(keys(l.boosts) as (keyof PlayerSkills)[], k => Math.abs(l.boosts[k]))) || 0;
      for (let restore = 0; restore <= limit; restore++) {
        yield {
          xValue: restore,
          loadouts: loadouts.map(l => {
            const newBoosts: PlayerSkills = {...l.boosts};
            keys(newBoosts).forEach(k => {
              const v = newBoosts[k];
              newBoosts[k] = Math.sign(v) * (Math.abs(v) - restore);
            });
            
            return {
              ...l,
              boosts: newBoosts,
            };
          }),
          monster: monster,
        };
      }
      return;

    default:
      throw new Error(`unimplemented xAxisType ${xAxisType}`);
  }

}

const YAxisOptions = [
  {label: 'Player damage-per-second', value: YAxisType.DPS},
  // {label: 'Time-to-kill', value: YAxisType.TTK},
  // {label: 'Damage taken', value: YAxisType.DAMAGE_TAKEN}
]

const getOutput = (
    yAxisType: YAxisType,
    loadout: Player,
    monster: Monster,
): number => {
  switch (yAxisType) {
    case YAxisType.DPS:
      return new CombatCalc(loadout, monster).getDps();

    default:
      throw new Error(`Unimplemented yAxisType ${yAxisType}`);
  }
}

const LoadoutComparison: React.FC = observer(() => {
  const store = useStore();
  const loadouts = toJS(store.loadouts);
  const monster = toJS(store.monster);

  const {resolvedTheme} = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [xAxisType, setXAxisType] = useState<{ label: string, value: XAxisType } | null | undefined>(XAxisOptions[0]);
  const [yAxisType, setYAxisType] = useState<{ label: string, value: YAxisType } | null | undefined>(YAxisOptions[0]);

  const data = useMemo(() => {
    const x = xAxisType?.value;
    const y = yAxisType?.value;
    if (x === undefined || y === undefined) {
      return {
        max: 1,
        lines: [],
      };
    }

    let max = 1;
    const lines: { name: number, [lKey: string]: string | number }[] = [];
    for (let input of inputRange(x, loadouts, monster)) {
      const entry: typeof lines[0] = {name: input.xValue,};
      input.loadouts.forEach((l, i) => {
        const v = getOutput(y, l, input.monster);
        entry[`Loadout ${i+1}`] = v.toFixed(2);
        max = Math.max(max, v);
      });
      lines.push(entry);
    }
    return {
      max,
      lines,
    };
  }, [xAxisType, yAxisType, monster, loadouts]);

  const generateLines = useCallback(() => {
    let lines: React.ReactNode[] = [];

    const strokeColours =
      isDark ?
        ['cyan', 'yellow', 'lime', 'orange', 'pink'] :
        ['blue', 'chocolate', 'green', 'sienna', 'purple']
    ;

    for (let i=0; i < loadouts.length; i++) {
      let colour = strokeColours.shift() || 'red';
      lines.push(<Line
        key={i}
        type="monotone"
        dataKey={`Loadout ${i+1}`}
        stroke={colour}
        dot={false}
        isAnimationActive={false}
      />);
      strokeColours.push(colour);
    }
    return lines;

  }, [loadouts, isDark])

  return (
    <>
      <ResponsiveContainer width={'100%'} height={200}>
        <LineChart
          data={data.lines}
        >
          <XAxis
            allowDecimals={true}
            dataKey="name"
            stroke="#777777"
            interval={'equidistantPreserveStart'}
          />
          <YAxis
            stroke="#777777"
            domain={[0, data.max]}
            interval={'equidistantPreserveStart'}
          />
          <CartesianGrid stroke="gray" strokeDasharray="5 5"/>
          <Tooltip
            content={(props) => <CustomTooltip {...props} />}
          />
          <Legend wrapperStyle={{fontSize: '.9em'}} />
          {generateLines()}
        </LineChart>
      </ResponsiveContainer>
      <div className={'my-4 flex flex-wrap md:flex-nowrap gap-4 max-w-lg m-auto dark:text-white'}>
        <div className={'basis-full md:basis-1/2'}>
          <h3 className={'font-serif font-bold mb-2'}>X axis</h3>
          <Select
            id={'loadout-comparison-x'}
            items={XAxisOptions}
            value={xAxisType || undefined}
            onSelectedItemChange={(i) => {
              setXAxisType(i)
            }}
          />
        </div>
        <div className={'basis-full md:basis-1/2'}>
          <h3 className={'font-serif font-bold mb-2'}>Y axis</h3>
          <Select
            id={'loadout-comparison-y'}
            items={YAxisOptions}
            value={yAxisType || undefined}
            onSelectedItemChange={(i) => {
              setYAxisType(i)
            }}
          />
        </div>
      </div>
    </>
  )
})

export default LoadoutComparison;
