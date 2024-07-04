import React, { useMemo } from 'react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';
import { getCdnImage, isDefined } from '@/utils';
import { EquipmentPiece } from '@/types/Player';
import LazyImage from '@/app/components/generic/LazyImage';
import { cross } from 'd3-array';
import { availableEquipment, equipmentAliases, noStatExceptions } from '@/lib/Equipment';
import { BLOWPIPE_IDS } from '@/lib/constants';
import Combobox from '../../generic/Combobox';

interface EquipmentOption {
  label: string;
  value: string;
  version: string;
  slot: string;
  equipment: EquipmentPiece;
}

const findDart = (name: string): EquipmentPiece | undefined => {
  const eq = availableEquipment.find((e) => e.name === name);
  if (!eq) {
    console.warn(`Failed to locate dart [${name}] for blowpipe dart entry generation, proceeding without this option.`);
  }
  return eq;
};
const DARTS: EquipmentPiece[] = [
  findDart('Bronze dart'),
  findDart('Iron dart'),
  findDart('Steel dart'),
  findDart('Mithril dart'),
  findDart('Adamant dart'),
  findDart('Rune dart'),
  findDart('Black dart'),
  findDart('Dragon dart'),
  findDart('Amethyst dart'),
].filter(isDefined);

const EquipmentSelect: React.FC = observer(() => {
  const store = useStore();

  const options: EquipmentOption[] = useMemo(() => {
    const blowpipeEntries: EquipmentOption[] = [];

    const entries: EquipmentOption[] = [];
    for (const v of availableEquipment.filter((eq) => {
      if (
        (
          (Object.values(eq.bonuses).reduce((a, b) => a + b, 0) === 0)
          && (Object.values(eq.offensive).reduce((a, b) => a + b, 0) === 0)
          && (Object.values(eq.defensive).reduce((a, b) => a + b, 0) === 0)
          && (eq.speed === 4 || eq.speed <= 0)
          && !noStatExceptions.includes(eq.name)
        )
        || eq.version.match(/^(Broken|Inactive|Locked)$/)
        || eq.name.match(/\((Last Man Standing|historical|beta)\)$/)
        || eq.name.match(/(Fine mesh net|Wilderness champion amulet|\(Wilderness Wars)/)
        || eq.name.match(/^Crystal .* \(i\)$/)
      ) {
        return false;
      }
      return true;
    })) {
      const e: EquipmentOption = {
        label: `${v.name}`,
        value: v.id.toString(),
        version: v.version || '',
        slot: v.slot,
        equipment: v,
      };

      if (BLOWPIPE_IDS.includes(v.id)) {
        blowpipeEntries.push(e);
      } else {
        entries.push(e);
      }
    }

    cross(blowpipeEntries, DARTS).forEach(([blowpipe, dart]) => {
      entries.push({
        ...blowpipe,
        label: `${blowpipe.label} (${dart.name.replace(' dart', '')})`,
        value: `${blowpipe.value}_${dart.id}`,
        equipment: {
          ...blowpipe.equipment,
          itemVars: {
            ...blowpipe.equipment.itemVars,
            blowpipeDartName: dart.name,
            blowpipeDartId: dart.id,
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
