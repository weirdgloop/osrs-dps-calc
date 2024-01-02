import React, {useCallback, useMemo, useState} from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart, Legend, Line, TooltipProps
} from 'recharts';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Select from "@/app/components/generic/Select";
import CombatCalc from "@/lib/CombatCalc";
import {PlayerComputed} from "@/types/Player";
import {getEquipmentForLoadout} from "@/utils";
import {Monster} from "@/types/Monster";
import {NameType, ValueType} from "recharts/types/component/DefaultTooltipContent";
import {toJS} from "mobx";
import {useTheme} from "next-themes";

enum XAxisType {
  MONSTER_DEF,
  MONSTER_MAGIC,
  PLAYER_ATTACK_LEVEL,
  PLAYER_STRENGTH_LEVEL,
  PLAYER_RANGED_LEVEL,
  PLAYER_MAGIC_LEVEL,
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
              return <div key={p.name} className={'flex justify-between w-28'}>
                {p.name}
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
  loadouts: PlayerComputed[],
    monster: Monster,
): Generator<{
  xValue: number,
  loadouts: PlayerComputed[],
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
    loadout: PlayerComputed,
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
      return [];
    }

    const computedLoadouts = loadouts.map(p => {
      return {
        ...p,
        equipment: getEquipmentForLoadout(p),
      }
    });

    const lines: { name: number, [lKey: string]: string | number }[] = [];
    for (let input of inputRange(x, computedLoadouts, monster)) {
      const entry: typeof lines[0] = {name: input.xValue};
      input.loadouts.forEach((l, i) => {
        entry[`Loadout ${i+1}`] = getOutput(y, l, input.monster).toFixed(2);
      });
      lines.push(entry);
    }
    return lines;
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
      lines.push(<Line key={i} type="monotone" dataKey={`Loadout ${i+1}`} stroke={colour} dot={false} />);
      strokeColours.push(colour);
    }
    return lines;

  }, [loadouts, isDark])

  return (
    <>
      <ResponsiveContainer width={'100%'} height={200}>
        <LineChart
          data={data}
        >
          <XAxis
            allowDecimals={true}
            dataKey="name"
            stroke="#777777"
            interval={'equidistantPreserveStart'}
          />
          <YAxis
            stroke="#777777"
            domain={[0, 'dataMax']}
            interval={'equidistantPreserveStart'}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} />}
          />
          <Legend />
          {generateLines()}
        </LineChart>
      </ResponsiveContainer>
      <div className={'my-4 flex gap-4 max-w-lg m-auto dark:text-white'}>
        <div className={'basis-1/2'}>
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
        <div className={'basis-1/2'}>
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
