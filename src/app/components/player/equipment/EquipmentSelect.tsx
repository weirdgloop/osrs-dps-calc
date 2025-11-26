import React, { useMemo } from 'react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';
import { getCdnImage, isDefined } from '@/utils';
import { EquipmentPiece } from '@/types/Player';
import LazyImage from '@/app/components/generic/LazyImage';
import { cross } from 'd3-array';
import {
  availableEquipment,
  CORRUPTED_GAUNTLET_EQUIPMENT_IDS,
  equipmentAliases,
  GAUNTLET_EQUIPMENT_IDS,
  noStatExceptions,
} from '@/lib/Equipment';
import { BLOWPIPE_IDS, GAUNTLET_MONSTER_IDS, CORRUPTED_GAUNTLET_MONSTER_IDS } from '@/lib/constants';
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

const DART_TIER: Record<string, number> = {
  'Bronze dart': 0,
  'Iron dart': 1,
  'Steel dart': 2,
  'Black dart': 3,
  'Mithril dart': 4,
  'Adamant dart': 5,
  'Rune dart': 6,
  'Amethyst dart': 7,
  'Dragon dart': 8,
};

const MAX_DART_TIER_BY_BLOWPIPE: Record<string, number> = {
  'Camphor blowpipe': DART_TIER['Mithril dart'],
  'Ironwood blowpipe': DART_TIER['Adamant dart'],
  'Rosewood blowpipe': DART_TIER['Adamant dart'],
};

const gauntletSort = (items: EquipmentOption[], monsterId: number) => {
  // If the selected NPC is in The Gauntlet prioritize Gauntlet Equipment
  if (GAUNTLET_MONSTER_IDS.includes(monsterId)) {
    return items.sort((a, b) => {
      const aPriority = GAUNTLET_EQUIPMENT_IDS.includes(a.equipment.id);
      const bPriority = GAUNTLET_EQUIPMENT_IDS.includes(b.equipment.id);
      if (aPriority && !bPriority) return -1;
      if (!aPriority && bPriority) return 1;
      return a.label.localeCompare(b.label);
    });
  }

  // If the selected NPC is in The Corrupted Gauntlet prioritize Corrupted Gauntlet Equipment
  if (CORRUPTED_GAUNTLET_MONSTER_IDS.includes(monsterId)) {
    return items.sort((a, b) => {
      const aPriority = CORRUPTED_GAUNTLET_EQUIPMENT_IDS.includes(a.equipment.id);
      const bPriority = CORRUPTED_GAUNTLET_EQUIPMENT_IDS.includes(b.equipment.id);
      if (aPriority && !bPriority) return -1;
      if (!aPriority && bPriority) return 1;
      return a.label.localeCompare(b.label);
    });
  }

  // If the selected NPC is not in The (Corrupted) Gauntlet all Gauntlet equipment is deprioritzed
  return items.sort((a, b) => {
    const aPriority = GAUNTLET_EQUIPMENT_IDS.includes(a.equipment.id) || CORRUPTED_GAUNTLET_EQUIPMENT_IDS.includes(a.equipment.id);
    const bPriority = GAUNTLET_EQUIPMENT_IDS.includes(b.equipment.id) || CORRUPTED_GAUNTLET_EQUIPMENT_IDS.includes(b.equipment.id);
    if (aPriority && !bPriority) return 1;
    if (!aPriority && bPriority) return -1;
    return a.label.localeCompare(b.label);
  });
};

const EquipmentSelect: React.FC = observer(() => {
  const store = useStore();

  const options: EquipmentOption[] = useMemo(() => {
    const blowpipeEntries: EquipmentOption[] = [];

    const entries: EquipmentOption[] = [];
    for (const v of availableEquipment.filter((eq) => {
      if (
        (
          (Object.values(eq.bonuses).every((val) => val === 0))
          && (Object.values(eq.offensive).every((val) => val === 0))
          && (Object.values(eq.defensive).every((val) => val === 0))
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

    cross(blowpipeEntries, DARTS)
      .filter(([blowpipe, dart]) => {
        const maxTier = MAX_DART_TIER_BY_BLOWPIPE[blowpipe.label];

        if (maxTier === undefined) {
          return true;
        }

        const dartTier = DART_TIER[dart.name];

        if (dartTier === undefined) {
          return true;
        }

        return dartTier <= maxTier;
      })
      .forEach(([blowpipe, dart]) => {
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

    return gauntletSort(entries, store.monster.id);
  }, [store.monster.id]);

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
        const remainingVariantMemberships: { [k: number]: number } = {}; // reverse map

        // For each option, add it to a variant group if necessary.
        for (const eqOpt of v) {
          const eqId = eqOpt.equipment.id;
          for (const [base, vars] of Object.entries(equipmentAliases)) {
            const baseId = parseInt(base);
            if (baseId === eqId || vars.includes(eqId)) {
              remainingVariantGroups[baseId] = remainingVariantGroups[baseId] ? [...remainingVariantGroups[baseId], eqId] : [eqId];
              remainingVariantMemberships[eqId] = baseId;
            }
          }
        }

        return v.filter((eqOpt) => {
          const eqId = eqOpt.equipment.id;

          // This is a base variant, keep it in the list
          const baseId: number | undefined = remainingVariantMemberships[eqId];
          if (baseId === eqId) return true;

          if (baseId !== undefined) {
            const group = remainingVariantGroups[baseId];
            if (group.includes(eqId)) {
              // Keep this item in the list if it's the first result,
              // and its base variant is filtered
              return group.indexOf(eqId) === 0 && !v.find((o) => o.equipment.id === baseId);
            }
          }

          // For everything else (probably items that aren't variants), keep in the list
          return true;
        });
      }}
      customSort={(v) => gauntletSort(v, store.monster.id)}
    />
  );
});

export default EquipmentSelect;
