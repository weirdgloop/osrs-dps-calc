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
import { toJS } from 'mobx';
import { max } from 'd3-array';
import { IconArrowsExchange, IconAlertTriangle } from '@tabler/icons-react';
import { useStore } from '@/state';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import type { WeaponSwapMode, WeaponSwapRange } from '@/lib/WeaponSwap';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

enum SwapMode {
  CONTINUOUS,
  DISCONTINUOUS,
}

const modeOptions = [
  {
    label: 'Continuous',
    value: SwapMode.CONTINUOUS,
    description: 'Assumes attacks continue naturally after the monster dies.',
  },
  {
    label: 'Discontinuous',
    value: SwapMode.DISCONTINUOUS,
    description: 'Shows swap breakpoints with the final attack cycle removed, matching fruitdeeps discontinuous mode.',
  },
];

const strokeColours = ['cyan', 'yellow', 'lime', 'orange', 'pink', '#8B9BE8'];
const warningClassName = [
  'w-full bg-yellow-500 text-white px-4 py-1 text-sm border-yellow-400',
  'flex items-center gap-2',
].join(' ');

const formatRange = (range: WeaponSwapRange): string => (
  range.fromHp === range.toHp
    ? `${range.fromHp} HP`
    : `${range.toHp}-${range.fromHp} HP`
);

type WeaponSwapChartEntry = {
  name: string,
  hitpoints: number,
  weaponOnlySeconds: number,
  [loadoutName: string]: string | number | null,
};

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  const visiblePayload = payload?.filter((p) => p.value !== null && p.value !== undefined);

  if (active && visiblePayload && visiblePayload.length) {
    const point = visiblePayload[0].payload as WeaponSwapChartEntry;
    return (
      <div className="bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2">
        <div>
          <p>
            <strong>
              {label}
              {' '}
              HP
            </strong>
          </p>
          {visiblePayload.map((p) => (
            <div key={p.name} className="flex justify-between w-44 gap-2">
              <div className="flex items-center gap-1 leading-3 overflow-hidden">
                <div>
                  <div
                    className="w-3 h-3 inline-block border border-gray-400 rounded-lg"
                    style={{ backgroundColor: p.color }}
                  />
                </div>
                {p.name}
              </div>
              <span className="text-gray-400 font-bold">
                {p.value === 'NaN' ? '---' : `${p.value}s`}
              </span>
            </div>
          ))}
          <div className="mt-1 flex justify-between w-44 gap-2 text-xs">
            <span className="text-gray-500">Camp this weapon only</span>
            <span className="text-gray-400 font-bold">
              {point.weaponOnlySeconds.toFixed(2)}
              s
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const WeaponSwap: React.FC = observer(() => {
  const store = useStore();
  const { showWeaponSwap } = store.prefs;
  const result = toJS(store.calc.weaponSwap);
  const loadouts = toJS(store.loadouts);
  const [mode, setMode] = useState(modeOptions[0]);

  const activeResult: WeaponSwapMode | undefined = useMemo(() => {
    if (!result) {
      return undefined;
    }
    return mode.value === SwapMode.CONTINUOUS ? result.continuous : result.discontinuous;
  }, [mode.value, result]);

  const yDomainMax = useMemo(() => {
    const high = max(activeResult?.points || [], (point) => point.expectedSeconds) || 1;
    return Math.ceil(high);
  }, [activeResult]);

  const generateLines = useCallback(() => loadouts.map((loadout, i) => (
    <Line
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      type="monotone"
      dataKey={loadout.name}
      stroke={strokeColours[i % strokeColours.length]}
      dot={false}
      connectNulls={false}
      isAnimationActive={false}
    />
  )), [loadouts]);

  const ranges = useMemo(
    () => [...(activeResult?.ranges || [])].sort((a, b) => b.toHp - a.toHp),
    [activeResult],
  );
  const chartData = useMemo((): WeaponSwapChartEntry[] => {
    if (!activeResult) {
      return [];
    }

    return activeResult.points.map((point) => {
      const entry: WeaponSwapChartEntry = {
        name: point.hitpoints.toString(),
        hitpoints: point.hitpoints,
        weaponOnlySeconds: point.weaponOnlyExpectedSeconds,
      };
      loadouts.forEach((loadout) => {
        entry[loadout.name] = null;
      });
      entry[point.loadoutName] = parseFloat(point.expectedSeconds.toFixed(2));
      return entry;
    }).reverse();
  }, [activeResult, loadouts]);

  return (
    <SectionAccordion
      defaultIsOpen={showWeaponSwap}
      onIsOpenChanged={(o) => store.updatePreferences({ showWeaponSwap: o })}
      title={(
        <div className="flex items-center gap-2">
          <IconArrowsExchange size={22} />
          <h3 className="font-serif font-bold">
            Optimal Weapon Swaps
          </h3>
        </div>
      )}
    >
      {!result && (
        <div
          className={`${warningClassName} border-b`}
        >
          <IconAlertTriangle className="text-orange-200" />
          <div>Add at least two damaging loadouts to compute swap breakpoints.</div>
        </div>
      )}
      {result && activeResult && (
        <div className="px-6 py-4">
          {result.truncated && (
            <div
              className={`mb-4 border ${warningClassName}`}
            >
              <IconAlertTriangle className="text-orange-200" />
              <div>
                Showing the first
                {' '}
                {result.cappedHp}
                {' '}
                HP of
                {' '}
                {result.currentHp}
                {' '}
                HP.
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{
                top: 40, right: 20, bottom: 10, left: 0,
              }}
            >
              <XAxis
                allowDecimals={false}
                dataKey="hitpoints"
                stroke="#777777"
                interval="equidistantPreserveStart"
                label={{ value: 'Monster HP', position: 'insideBottom', offset: -10 }}
              />
              <YAxis
                stroke="#777777"
                domain={[0, yDomainMax]}
                tickFormatter={(v: number) => `${parseFloat(v.toFixed(1))}`}
                label={{
                  value: 'Seconds', position: 'insideLeft', angle: -90, style: { textAnchor: 'middle' },
                }}
              />
              <CartesianGrid stroke="gray" strokeDasharray="5 5" />
              <Tooltip
                filterNull
                content={(props) => <CustomTooltip {...props} />}
              />
              <Legend wrapperStyle={{ fontSize: '.9em', top: 0 }} />
              {generateLines()}
            </LineChart>
          </ResponsiveContainer>
          <div className="my-4 flex flex-wrap gap-2 dark:text-white">
            {modeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.description}
                onClick={() => setMode(opt)}
                className={`px-3 py-1 border text-sm transition-colors ${
                  mode.value === opt.value
                    ? 'bg-orange-400 dark:bg-orange-700 border-orange-500 text-white'
                    : 'bg-btns-400 dark:bg-dark-500 border-body-100 dark:border-dark-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto text-black dark:text-body-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-4 py-1.5 border-r bg-btns-400 dark:bg-dark-500 dark:text-white">
                    Monster HP
                  </th>
                  <th className="text-left px-4 py-1.5 bg-btns-400 dark:bg-dark-500 dark:text-white">
                    Use loadout
                  </th>
                </tr>
              </thead>
              <tbody>
                {ranges.map((range) => (
                  <tr key={`${range.loadoutIndex}-${range.fromHp}-${range.toHp}`}>
                    <td className="px-4 py-1.5 border-r">{formatRange(range)}</td>
                    <td className="px-4 py-1.5">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-3 h-3 inline-block border border-gray-400 rounded-lg"
                          style={{ backgroundColor: strokeColours[range.loadoutIndex % strokeColours.length] }}
                        />
                        {range.loadoutName}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionAccordion>
  );
});

export default WeaponSwap;
