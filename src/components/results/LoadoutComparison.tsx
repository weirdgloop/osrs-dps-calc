import React, {useEffect, useMemo, useState} from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart, Legend, Line
} from 'recharts';
import Select from 'react-select';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../state';

enum YAxisType {
  MONSTER_DEF,
  BASE_LEVEL,
}

enum XAxisType {
  TTK,
  DPS,
  DAMAGE_TAKEN
}

const XAxisOptions = [
  {label: 'Time-to-kill', value: XAxisType.TTK},
  {label: 'Damage-per-second', value: XAxisType.DPS},
  {label: 'Damage taken', value: XAxisType.DAMAGE_TAKEN}
]

const YAxisOptions = [
  {label: 'Monster defence level', value: YAxisType.MONSTER_DEF},
  {label: 'Player base levels', value: YAxisType.BASE_LEVEL}
]

const LoadoutComparison: React.FC = observer(() => {
  const store = useStore();
  const {loadouts} = store;

  const [xAxisType, setXAxisType] = useState<{ label: string, value: XAxisType } | null>(XAxisOptions[0]);
  const [yAxisType, setYAxisType] = useState<{ label: string, value: YAxisType } | null>(YAxisOptions[0]);

  const data = useMemo(() => {
    const x = xAxisType?.value;
    const y = yAxisType?.value;

    // When the X axis type or Y axis type changes, re-calculate the data
    // TODO @cook (e.g (if x === XAxisType.TTK) { doSomething; }
    return [
      {name: 0, 'Loadout 1': 1, 'Loadout 2': 5, 'Loadout 3': 2, 'Loadout 4': 4, 'Loadout 5': 1},
      {name: 1, 'Loadout 1': 7, 'Loadout 2': 9, 'Loadout 3': 12, 'Loadout 4': 2, 'Loadout 5': 10},
      {name: 2, 'Loadout 1': 3, 'Loadout 2': 1, 'Loadout 3': 13, 'Loadout 4': 6, 'Loadout 5': 12},
      {name: 3, 'Loadout 1': 4, 'Loadout 2': 2, 'Loadout 3': 4, 'Loadout 4': 8, 'Loadout 5': 14},
      {name: 4, 'Loadout 1': 8, 'Loadout 2': 10, 'Loadout 3': 8, 'Loadout 4': 3, 'Loadout 5': 0},
      {name: 5, 'Loadout 1': 2, 'Loadout 2': 14, 'Loadout 3': 3, 'Loadout 4': 3, 'Loadout 5': 2},
    ]
  }, [xAxisType, yAxisType]);

  const generateLines = () => {
    let lines: JSX.Element[] = [];
    let strokeColours = ['red', 'blue', 'purple', 'green', 'sienna'];

    for (let i=0; i < loadouts.length; i++) {
      let colour = strokeColours.shift() || 'red';
      lines.push(<Line type="monotone" dataKey={`Loadout ${i+1}`} stroke={colour} />);
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
      <div className={'my-4 flex gap-4 max-w-lg m-auto'}>
        <div className={'basis-1/2'}>
          <h3 className={'font-serif font-bold mb-2'}>Y axis</h3>
          <Select
            className={'text-sm'}
            value={yAxisType}
            options={YAxisOptions}
            onChange={(v) => setYAxisType(v)}
          />
        </div>
        <div className={'basis-1/2'}>
          <h3 className={'font-serif font-bold mb-2'}>X axis</h3>
          <Select
            className={'text-sm'}
            value={xAxisType}
            options={XAxisOptions}
            onChange={(v) => setXAxisType(v)}
          />
        </div>
      </div>
    </>
  )
})

export default LoadoutComparison;