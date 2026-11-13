import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import Combobox from '@/app/components/generic/Combobox';
import LazyImage from '@/app/components/generic/LazyImage';
import {
  collapseVariants, EQUIPMENT_OPTIONS, EquipmentOption, sortForMonster,
} from '@/app/components/player/equipment/equipmentOptions';
import { useMonster } from '@/state/MonsterStore';
import { usePlayer } from '@/state/PlayerStore';
import { getCdnImage } from '@/utils';

const EquipmentOptionLabel: React.FC<{ item: EquipmentOption, itemString: string }> = ({ item, itemString }) => (
  <div className="flex items-center gap-2">
    <div className="basis-4 flex justify-center h-[20px] w-auto">
      {item.equipment.image && (<LazyImage responsive src={getCdnImage(`equipment/${item.equipment.image}`)} alt="" />)}
    </div>
    <div>
      {itemString}
      {item.version && (
        <span className="monster-version text-xs text-gray-400 dark:text-gray-300">
          #
          {item.version}
        </span>
      )}
    </div>
  </div>
);

const EquipmentSelect: React.FC = observer(() => {
  const monster = useMonster();
  const player = usePlayer();
  const options = useMemo(() => sortForMonster(EQUIPMENT_OPTIONS, monster.id), [monster.id]);
  const customSort = useCallback((items: EquipmentOption[]) => sortForMonster(items, monster.id), [monster.id]);
  const onSelectedItemChange = useCallback((item: EquipmentOption | null | undefined) => {
    if (item) player.setEquipment({ [item.equipment.slot]: item.equipment });
  }, [player]);

  return (
    <Combobox<EquipmentOption>
      id="equipment-select"
      className="w-full"
      items={options}
      keepOpenAfterSelect
      keepPositionAfterSelect
      placeholder="Search for equipment..."
      onSelectedItemChange={onSelectedItemChange}
      CustomItemComponent={EquipmentOptionLabel}
      customFilter={collapseVariants}
      customSort={customSort}
    />
  );
});

export default EquipmentSelect;
