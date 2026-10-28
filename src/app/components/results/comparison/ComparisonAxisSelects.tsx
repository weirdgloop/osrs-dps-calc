import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import Select from '@/app/components/generic/Select';
import { X_AXIS_OPTIONS, Y_AXIS_OPTIONS } from '@/app/components/results/comparison/comparisonAxes';
import { useUI } from '@/state/UIStore';

const ComparisonAxisSelects: React.FC = observer(() => {
  const ui = useUI();
  const { compareYAxisOptions } = ui;
  const yOptions = useMemo(() => compareYAxisOptions.map((axis) => Y_AXIS_OPTIONS[axis]), [compareYAxisOptions]);

  return (
    <div className="my-4 flex flex-wrap md:flex-nowrap gap-4 max-w-lg m-auto dark:text-white">
      <div className="basis-full md:basis-1/2">
        <h3 className="font-serif font-bold mb-2">X axis</h3>
        <Select
          id="loadout-comparison-x"
          items={X_AXIS_OPTIONS}
          value={X_AXIS_OPTIONS.find((o) => o.value === ui.compareXAxis)}
          onSelectedItemChange={(option) => option && ui.update({ compareXAxis: option.value })}
        />
      </div>
      <div className="basis-full md:basis-1/2">
        <h3 className="font-serif font-bold mb-2">Y axis</h3>
        <Select
          id="loadout-comparison-y"
          items={yOptions}
          value={Y_AXIS_OPTIONS[ui.compareY]}
          onSelectedItemChange={(option) => option && ui.update({ compareYAxis: option.value })}
        />
      </div>
    </div>
  );
});

export default ComparisonAxisSelects;
