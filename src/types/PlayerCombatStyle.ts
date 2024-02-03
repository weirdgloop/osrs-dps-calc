// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
export type CombatStyleType = null | 'slash' | 'crush' | 'stab' | 'magic' | 'ranged';
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
  // Psuedo stances
  'Manual Cast';

export interface PlayerCombatStyle {
  name: string,
  type: CombatStyleType,
  stance: CombatStyleStance,
}
