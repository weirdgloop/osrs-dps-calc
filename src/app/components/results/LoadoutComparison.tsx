import React, {useMemo, useState} from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart, Legend, Line
} from 'recharts';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Select from "@/app/components/generic/Select";
import CombatCalc from "@/lib/CombatCalc";
import {PlayerComputed} from "@/types/Player";
import {getEquipmentForLoadout} from "@/utils";
import {Monster} from "@/types/Monster";

enum XAxisType {
  MONSTER_DEF,
  BASE_LEVEL,
}

enum YAxisType {
  // TTK,
  DPS,
  // DAMAGE_TAKEN
}

const XAxisOptions = [
  {label: 'Monster defence level', value: XAxisType.MONSTER_DEF},
  {label: 'Player base levels', value: XAxisType.BASE_LEVEL},
]

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
    case XAxisType.BASE_LEVEL:
    case XAxisType.MONSTER_DEF:
      for (let newDef = monster.skills.def; newDef >= 0; newDef--) {
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

    default:
      throw new Error(`unimplemented xAxisType ${xAxisType}`);
  }
  
}

const YAxisOptions = [
  {label: 'Damage-per-second', value: YAxisType.DPS},
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
  const {loadouts, monster} = store;

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

    const lines: { name: number, [lKey: string]: number }[] = [];
    for (let input of inputRange(x, computedLoadouts, monster)) {
      const entry: typeof lines[0] = {name: input.xValue};
      input.loadouts.forEach((l, i) => {
        entry[`Loadout ${i+1}`] = getOutput(y, l, input.monster);
      });
      lines.push(entry);
    }
    console.log(lines);
    return lines;
  }, [xAxisType, yAxisType, monster, loadouts]);

  const generateLines = () => {
    let lines: React.ReactNode[] = [];
    let strokeColours = ['red', 'blue', 'purple', 'green', 'sienna'];

    for (let i=0; i < loadouts.length; i++) {
      let colour = strokeColours.shift() || 'red';
      lines.push(<Line key={i} type="monotone" dataKey={`Loadout ${i+1}`} stroke={colour} />);
      strokeColours.push(colour);
    }
    return lines;
  }

  return (
    <>
      <ResponsiveContainer width={'100%'} height={200}>
        <LineChart
          data={data}
        >
          <CartesianGrid strokeDasharray="5 3" />
          <XAxis
            allowDecimals={true}
            dataKey="name"
            stroke="#777777"
          />
          <YAxis
            stroke="#777777"
            domain={[0, 'dataMax']}
          />
          <Tooltip />
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