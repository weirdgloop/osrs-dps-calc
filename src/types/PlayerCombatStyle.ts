// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
import { EquipmentCategory } from '@/enums/EquipmentCategory';

export const CombatStyleTypes = [
  'stab',
  'slash',
  'crush',
  'magic',
  'ranged',
] as const;
export type CombatStyleType = typeof CombatStyleTypes[number] | null;
export function isCombatStyleType(s: string | null | undefined): s is CombatStyleType {
  if (s === undefined) {
    return false;
  }
  return s === null || CombatStyleTypes.includes(s as typeof CombatStyleTypes[number]);
}

// The actual player stat is still "ranged" so I'm not placing this in CombatStyleTypes
export const RangedDamageTypes = [
  'light',
  'standard',
  'heavy',
  'mixed',
] as const;
export type RangedDamageType = typeof RangedDamageTypes[number];
export function getRangedDamageType(category: EquipmentCategory): RangedDamageType {
  switch (category) {
    case EquipmentCategory.THROWN:
      return 'light';

    case EquipmentCategory.BOW:
      return 'standard';

    case EquipmentCategory.CROSSBOW:
    case EquipmentCategory.CHINCHOMPA:
      return 'heavy';

    case EquipmentCategory.SALAMANDER:
      return 'mixed';

    default:
      throw new Error(`Not a ranged weapon category: ${category}`);
  }
}

export type CombatStyleStance =
  null |
  'Accurate' |
  'Aggressive' |
  'Autocast' |
  'Controlled' |
  'Defensive' |
  'Defensive Autocast' |
  'Longrange' |
  'Rapid' |
  // Pseudo stances
  'Manual Cast';

export interface PlayerCombatStyle {
  name: string,
  type: CombatStyleType,
  stance: CombatStyleStance,
}
