// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
export type CombatStyleType = 'slash' | 'crush' | 'stab' | 'magic' | 'ranged';
export type CombatStyleStance =
  'Accurate' |
  'Aggressive' |
  'Autocast' |
  'Controlled' |
  'Defensive' |
  'Defensive Autocast' |
  'Longrange' |
  'Rapid';

export interface PlayerCombatStyle {
  name: string,
  type: CombatStyleType,
  stance: CombatStyleStance,
}
