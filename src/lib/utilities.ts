import {PlayerSkills} from '@/types/State';

/**
 * Calculates a player's combat level using their skills
 * @param s
 */
export const calculateCombatLevel = (s: PlayerSkills) => {
  const baseLevel = 0.25 * (s.def + s.hp + Math.floor(s.prayer / 2));
  const meleeCbLevel = 0.325 * (s.atk + s.str);
  const magicCbLevel = 0.325 * (Math.floor(s.magic / 2) + s.magic);
  const rangedCbLevel = 0.325 * (Math.floor(s.ranged / 2) + s.ranged);
  const cbType = Math.max(meleeCbLevel, Math.max(magicCbLevel, rangedCbLevel));
  const cbLevelDouble = baseLevel + cbType;

  // Return the combat level
  return Math.floor(cbLevelDouble);
}

export const getWikiImage = (filename: string) => {
  return `https://oldschool.runescape.wiki/images/${filename.replaceAll(' ', '_')}?11111`
}