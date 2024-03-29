// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
export const CombatStyleTypes = [
  'slash',
  'crush',
  'stab',
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
