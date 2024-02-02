import React, { useMemo } from 'react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';
import { getCdnImage } from '@/utils';
import { EquipmentPiece, EquipmentSlot } from '@/types/Player';
import LazyImage from '@/app/components/generic/LazyImage';
import { cross } from 'd3-array';
import { availableEquipment, equipmentAliases } from '@/lib/Equipment';
import Combobox from '../../generic/Combobox';

interface EquipmentOption {
  label: string;
  value: string;
  version: string;
  slot: string;
  equipment: EquipmentPiece;
}

interface EquipmentSelectProps {
  slot: EquipmentSlot | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const BLOWPIPE_IDS: string[] = [
  '12926', // regular
  '28688', // blazing
];

const DART_IDS: string[] = [
  '806', // bronze
  '807', // iron
  '808', // steel
  '809', // mithril
  '810', // adamant
  '811', // rune
  '3093', // black
  '11230', // dragon
  '25849', // amethyst
];

const EquipmentSelect: React.FC<EquipmentSelectProps> = observer(({ slot, inputRef }) => {
  const store = useStore();

  const options: EquipmentOption[] = useMemo(() => {
    const blowpipeEntries: EquipmentOption[] = [];
    const dartEntries: EquipmentOption[] = [];

    const entries: EquipmentOption[] = [];
    for (const v of availableEquipment) {
      const e: EquipmentOption = {
        label: `${v.name}`,
        value: v.id.toString(),
        version: v.version || '',
        slot: v.slot,
        equipment: v,
      };

      if (BLOWPIPE_IDS.includes(e.value)) {
        blowpipeEntries.push(e);
      } else if (DART_IDS.includes(e.value)) {
        dartEntries.push(e);
        entries.push(e);
      } else {
        entries.push(e);
      }
    }

    cross(blowpipeEntries, dartEntries).forEach(([blowpipe, dart]) => {
      const newStrength = blowpipe.equipment.bonuses.ranged_str + dart.equipment.bonuses.ranged_str;
      entries.push({
        ...blowpipe,
        label: `${blowpipe.label} (${dart.label.split(' ', 2)[0]})`,
        value: `${blowpipe.value}_${dart.value}`,
        equipment: {
          ...blowpipe.equipment,
          bonuses: {
            ...blowpipe.equipment.bonuses,
            ranged_str: newStrength,
          },
        },
      });
    });

    return entries;
  }, []);

  return (
    <Combobox<EquipmentOption>
      id="equipment-select"
      className="w-full"
      items={options}
      inputRef={inputRef}
      keepOpenAfterSelect
      keepPositionAfterSelect
      placeholder="Search for equipment..."
      onSelectedItemChange={(item) => {
        if (item) {
          store.updatePlayer({
            equipment: {
              [item.equipment.slot]: item.equipment,
            },
          });
        }
      }}
      CustomItemComponent={({ item, itemString }) => (
        <div className="flex items-center gap-2">
          <div className="basis-4 flex justify-center h-[20px] w-auto">
            {item.equipment.image && (<LazyImage responsive src={item.equipment.image ? getCdnImage(`equipment/${item.equipment.image}`) : undefined} alt="" />)}
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
      )}
      customFilter={(v) => {
        const remainingVariantGroups: { [k: number]: number[] } = {};

        // For each option, add it to a variant group if necessary.
        for (const eqOpt of v) {
          const eqId = eqOpt.equipment.id;
          for (const [base, vars] of Object.entries(equipmentAliases)) {
            const baseId = parseInt(base);
            if (baseId === eqId || vars.includes(eqId)) {
              remainingVariantGroups[baseId] = remainingVariantGroups[baseId] ? [...remainingVariantGroups[baseId], eqId] : [eqId];
            }
          }
        }

        return v.filter((eqOpt) => {
          if (slot && eqOpt.slot !== slot) return false;
          const eqId = eqOpt.equipment.id;

          // This is a base variant, keep it in the list
          if (Object.keys(equipmentAliases).includes(eqId.toString())) return true;

          for (const group of Object.values(remainingVariantGroups)) {
            if (group.includes(eqId)) {
              // Keep this item in the list if it is the only one left
              return group.length === 1;
            }
          }

          // For everything else (probably items that aren't variants), keep in the list
          return true;
        });
      }}
    />
  );
});

export default EquipmentSelect;
