import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc,
  getTestMonsterById,
  getTestPlayer,
} from '@/tests/utils/TestUtils';

type GlyphicTestCase = {
  prayerBonus: number;
  strBonus: number;
  normalMax: number;
  glyphicMax: number;
};

/* eslint-disable object-curly-newline */
const testCases: GlyphicTestCase[] = [
  { prayerBonus: 32, strBonus: 54, normalMax: 20, glyphicMax: 28 },
  { prayerBonus: 31, strBonus: 54, normalMax: 20, glyphicMax: 28 },
  { prayerBonus: 21, strBonus: 39, normalMax: 18, glyphicMax: 22 },
  { prayerBonus: 20, strBonus: 39, normalMax: 18, glyphicMax: 22 },
  { prayerBonus: 20, strBonus: 31, normalMax: 16, glyphicMax: 19 },
  { prayerBonus: 10, strBonus: 21, normalMax: 15, glyphicMax: 16 },
  { prayerBonus: 0, strBonus: 6, normalMax: 12, glyphicMax: 12 },
  { prayerBonus: 0, strBonus: 0, normalMax: 11, glyphicMax: 11 },
  { prayerBonus: 10, strBonus: 0, normalMax: 11, glyphicMax: 11 },
  { prayerBonus: 41, strBonus: 1, normalMax: 11, glyphicMax: 18 },
  { prayerBonus: 31, strBonus: 1, normalMax: 11, glyphicMax: 15 },
  { prayerBonus: 55, strBonus: 1, normalMax: 11, glyphicMax: 21 },
  { prayerBonus: 62, strBonus: 11, normalMax: 13, glyphicMax: 25 },
  { prayerBonus: 57, strBonus: 11, normalMax: 13, glyphicMax: 25 },
  { prayerBonus: 37, strBonus: 36, normalMax: 17, glyphicMax: 25 },
  { prayerBonus: 41, strBonus: 36, normalMax: 17, glyphicMax: 28 },
  { prayerBonus: 44, strBonus: 36, normalMax: 17, glyphicMax: 28 },
  { prayerBonus: 47, strBonus: 36, normalMax: 17, glyphicMax: 29 },
];
/* eslint-enable object-curly-newline */

const makePlayer = (
  monster: ReturnType<typeof getTestMonsterById>,
  prayerBonus: number,
  strBonus: number,
) => getTestPlayer(monster, {
  skills: {
    str: 99,
  },
  style: {
    name: 'Kick',
    type: 'crush',
    stance: 'Aggressive',
  },
  bonuses: {
    str: strBonus,
    prayer: prayerBonus,
  },
});

describe('Yama observed max hits', () => {
  test.each(testCases)(
    'normal: prayer $prayerBonus, strength $strBonus',
    ({ prayerBonus, strBonus, normalMax }) => {
      const monster = getTestMonsterById(14176);
      const player = makePlayer(monster, prayerBonus, strBonus);

      const { maxHit } = calculatePlayerVsNpc(monster, player);

      expect(maxHit).toBe(normalMax);
    },
  );

  test.each(testCases)(
    'glyphic: prayer $prayerBonus, strength $strBonus',
    ({ prayerBonus, strBonus, glyphicMax }) => {
      const monster = getTestMonsterById(100001);
      const player = makePlayer(monster, prayerBonus, strBonus);

      const { maxHit } = calculatePlayerVsNpc(monster, player);

      expect(maxHit).toBe(glyphicMax);
    },
  );
});
