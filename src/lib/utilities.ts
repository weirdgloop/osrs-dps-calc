import {PlayerSkills} from '@/types/PlayerAttributes';

/**
 * Calculates a player's combat level using their skills
 * @param skills
 */
export const calculateCombatLevel = (skills: PlayerSkills) => {
  const baseLevel = 0.25 * (skills.Defence + skills.Hitpoints + Math.floor(skills.Prayer / 2));
  const meleeCbLevel = 0.325 * (skills.Attack + skills.Strength);
  const magicCbLevel = 0.325 * (Math.floor(skills.Magic / 2) + skills.Magic);
  const rangedCbLevel = 0.325 * (Math.floor(skills.Ranged / 2) + skills.Ranged);
  const cbType = Math.max(meleeCbLevel, Math.max(magicCbLevel, rangedCbLevel));
  const cbLevelDouble = baseLevel + cbType;

  // Return the combat level
  return Math.floor(cbLevelDouble);
}