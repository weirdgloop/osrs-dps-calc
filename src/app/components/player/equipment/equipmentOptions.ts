import { cross } from 'd3-array';
import {
  availableEquipment,
  CORRUPTED_GAUNTLET_EQUIPMENT_IDS,
  equipmentAliases,
  GAUNTLET_EQUIPMENT_IDS,
  noStatExceptions,
} from '@/lib/Equipment';
import { BLOWPIPE_IDS, CORRUPTED_GAUNTLET_MONSTER_IDS, GAUNTLET_MONSTER_IDS } from '@/lib/constants';
import { EquipmentPiece } from '@/types/Player';
import { isDefined } from '@/utils';

export interface EquipmentOption {
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
  'Rosewood blowpipe': DART_TIER['Rune dart'],
};

const isSelectable = (eq: EquipmentPiece) => !((
  (Object.values(eq.bonuses).every((val) => val === 0))
    && (Object.values(eq.offensive).every((val) => val === 0))
    && (Object.values(eq.defensive).every((val) => val === 0))
    && (eq.speed === 4 || eq.speed <= 0)
    && !noStatExceptions.includes(eq.name)
)
  || eq.version.match(/^(Broken|Inactive|Locked)$/)
  || eq.name.match(/\((Last Man Standing|historical|beta)\)$/)
  || eq.name.match(/(Fine mesh net|Wilderness champion amulet|\(Wilderness Wars)/)
  || eq.name.match(/^Crystal .* \(i\)$/));

const buildOptions = (): EquipmentOption[] => {
  const blowpipeEntries: EquipmentOption[] = [];
  const entries: EquipmentOption[] = [];

  for (const v of availableEquipment.filter(isSelectable)) {
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

  // each blowpipe comes with every dart it can fire
  cross(blowpipeEntries, DARTS)
    .filter(([blowpipe, dart]) => {
      const maxTier = MAX_DART_TIER_BY_BLOWPIPE[blowpipe.label];
      const dartTier = DART_TIER[dart.name];
      return maxTier === undefined || dartTier === undefined || dartTier <= maxTier;
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

  return entries;
};

export const EQUIPMENT_OPTIONS: readonly EquipmentOption[] = buildOptions();

/**
 * Equipment id -> ids of every base item whose variant group it belongs to (itself included, if it is a base).
 */
const BASES_BY_MEMBER_ID = new Map<number, number[]>();
for (const [base, vars] of Object.entries(equipmentAliases)) {
  const baseId = parseInt(base);
  for (const memberId of new Set([baseId, ...vars])) {
    const bases = BASES_BY_MEMBER_ID.get(memberId);
    if (bases) bases.push(baseId);
    else BASES_BY_MEMBER_ID.set(memberId, [baseId]);
  }
}

export const sortForMonster = (items: readonly EquipmentOption[], monsterId: number): EquipmentOption[] => {
  const isGauntletItem = (o: EquipmentOption) => {
    if (GAUNTLET_MONSTER_IDS.includes(monsterId)) {
      return GAUNTLET_EQUIPMENT_IDS.includes(o.equipment.id);
    }
    if (CORRUPTED_GAUNTLET_MONSTER_IDS.includes(monsterId)) {
      return CORRUPTED_GAUNTLET_EQUIPMENT_IDS.includes(o.equipment.id);
    }
    return GAUNTLET_EQUIPMENT_IDS.includes(o.equipment.id) || CORRUPTED_GAUNTLET_EQUIPMENT_IDS.includes(o.equipment.id);
  };
  const gauntletFirst = GAUNTLET_MONSTER_IDS.includes(monsterId) || CORRUPTED_GAUNTLET_MONSTER_IDS.includes(monsterId);

  return [...items].sort((a, b) => {
    const aGauntlet = isGauntletItem(a);
    const bGauntlet = isGauntletItem(b);
    if (aGauntlet !== bGauntlet) {
      return aGauntlet === gauntletFirst ? -1 : 1;
    }
    return a.label.localeCompare(b.label);
  });
};

/**
 * Hides variants of items unless their base form has already been filtered out
 * e.g. scythe of vitur hides sanguine scythe unless you type "sanguine"
 */
export const collapseVariants = (options: EquipmentOption[]): EquipmentOption[] => {
  // For each base item, the first option (in list order) that belongs to its variant group.
  const firstInGroup = new Map<number, number>();
  const presentIds = new Set<number>();

  for (const eqOpt of options) {
    const eqId = eqOpt.equipment.id;
    presentIds.add(eqId);
    const bases = BASES_BY_MEMBER_ID.get(eqId);
    if (bases) {
      for (const baseId of bases) {
        if (!firstInGroup.has(baseId)) firstInGroup.set(baseId, eqId);
      }
    }
  }

  return options.filter((eqOpt) => {
    const eqId = eqOpt.equipment.id;
    const bases = BASES_BY_MEMBER_ID.get(eqId);

    // Not part of any variant group, keep it in the list
    if (!bases) return true;

    // If an item is in several groups, the last one wins
    const baseId = bases[bases.length - 1];

    // This is a base variant, keep it in the list
    if (baseId === eqId) return true;

    // Keep this item in the list if it's the first result in its group,
    // and its base variant is filtered
    return firstInGroup.get(baseId) === eqId && !presentIds.has(baseId);
  });
};
