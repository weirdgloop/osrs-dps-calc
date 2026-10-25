import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc,
  findEquipment,
  findSpell,
  getTestMonsterById,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { Prayer } from '@/enums/Prayer';

type TanglefootTestCase = {
  strengthLevel: number,
  strengthBonus: number,
  farmingLevel: number,
  observedMax: number,
};

/* eslint-disable object-curly-newline */
const testCases: TanglefootTestCase[] = [
  { strengthLevel: 7, strengthBonus: 73, farmingLevel: 0, observedMax: 0 },
  { strengthLevel: 8, strengthBonus: 73, farmingLevel: 0, observedMax: 1 },
  { strengthLevel: 11, strengthBonus: 73, farmingLevel: 0, observedMax: 1 },
  { strengthLevel: 12, strengthBonus: 73, farmingLevel: 0, observedMax: 2 },
  { strengthLevel: 14, strengthBonus: 1, farmingLevel: 0, observedMax: 0 },
  { strengthLevel: 15, strengthBonus: 1, farmingLevel: 0, observedMax: 1 },
  { strengthLevel: 16, strengthBonus: 73, farmingLevel: 0, observedMax: 2 },
  { strengthLevel: 17, strengthBonus: 73, farmingLevel: 0, observedMax: 3 },
  { strengthLevel: 21, strengthBonus: 73, farmingLevel: 0, observedMax: 3 },
  { strengthLevel: 22, strengthBonus: 73, farmingLevel: 0, observedMax: 4 },
  { strengthLevel: 24, strengthBonus: 1, farmingLevel: 0, observedMax: 1 },
  { strengthLevel: 25, strengthBonus: 1, farmingLevel: 0, observedMax: 2 },
  { strengthLevel: 25, strengthBonus: 73, farmingLevel: 0, observedMax: 4 },
  { strengthLevel: 26, strengthBonus: 73, farmingLevel: 0, observedMax: 5 },
  { strengthLevel: 30, strengthBonus: 73, farmingLevel: 0, observedMax: 5 },
  { strengthLevel: 31, strengthBonus: 73, farmingLevel: 0, observedMax: 6 },
  { strengthLevel: 34, strengthBonus: 1, farmingLevel: 0, observedMax: 2 },
  { strengthLevel: 35, strengthBonus: 1, farmingLevel: 0, observedMax: 3 },
  { strengthLevel: 44, strengthBonus: 1, farmingLevel: 0, observedMax: 3 },
  { strengthLevel: 45, strengthBonus: 1, farmingLevel: 0, observedMax: 4 },
  { strengthLevel: 54, strengthBonus: 1, farmingLevel: 0, observedMax: 4 },
  { strengthLevel: 55, strengthBonus: 1, farmingLevel: 0, observedMax: 5 },
  { strengthLevel: 63, strengthBonus: 1, farmingLevel: 0, observedMax: 5 },
  { strengthLevel: 64, strengthBonus: 1, farmingLevel: 0, observedMax: 6 },
  { strengthLevel: 73, strengthBonus: 1, farmingLevel: 0, observedMax: 6 },
  { strengthLevel: 74, strengthBonus: 1, farmingLevel: 0, observedMax: 7 },
  { strengthLevel: 83, strengthBonus: 1, farmingLevel: 0, observedMax: 7 },
  { strengthLevel: 84, strengthBonus: 1, farmingLevel: 0, observedMax: 8 },
  { strengthLevel: 93, strengthBonus: 1, farmingLevel: 0, observedMax: 8 },
  { strengthLevel: 94, strengthBonus: 1, farmingLevel: 0, observedMax: 9 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 0, observedMax: 9 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 14, observedMax: 9 },
  { strengthLevel: 14, strengthBonus: 1, farmingLevel: 15, observedMax: 0 },
  { strengthLevel: 15, strengthBonus: 1, farmingLevel: 15, observedMax: 1 },
  { strengthLevel: 23, strengthBonus: 1, farmingLevel: 15, observedMax: 1 },
  { strengthLevel: 24, strengthBonus: 1, farmingLevel: 15, observedMax: 2 },
  { strengthLevel: 32, strengthBonus: 1, farmingLevel: 15, observedMax: 2 },
  { strengthLevel: 33, strengthBonus: 1, farmingLevel: 15, observedMax: 3 },
  { strengthLevel: 42, strengthBonus: 1, farmingLevel: 15, observedMax: 3 },
  { strengthLevel: 43, strengthBonus: 1, farmingLevel: 15, observedMax: 4 },
  { strengthLevel: 51, strengthBonus: 1, farmingLevel: 15, observedMax: 4 },
  { strengthLevel: 52, strengthBonus: 1, farmingLevel: 15, observedMax: 5 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 15, observedMax: 10 },
  { strengthLevel: 13, strengthBonus: 1, farmingLevel: 25, observedMax: 0 },
  { strengthLevel: 14, strengthBonus: 1, farmingLevel: 25, observedMax: 1 },
  { strengthLevel: 22, strengthBonus: 1, farmingLevel: 25, observedMax: 1 },
  { strengthLevel: 23, strengthBonus: 1, farmingLevel: 25, observedMax: 2 },
  { strengthLevel: 31, strengthBonus: 1, farmingLevel: 25, observedMax: 2 },
  { strengthLevel: 32, strengthBonus: 1, farmingLevel: 25, observedMax: 3 },
  { strengthLevel: 41, strengthBonus: 1, farmingLevel: 25, observedMax: 3 },
  { strengthLevel: 42, strengthBonus: 1, farmingLevel: 25, observedMax: 4 },
  { strengthLevel: 50, strengthBonus: 1, farmingLevel: 25, observedMax: 4 },
  { strengthLevel: 51, strengthBonus: 1, farmingLevel: 25, observedMax: 5 },
  { strengthLevel: 59, strengthBonus: 1, farmingLevel: 25, observedMax: 5 },
  { strengthLevel: 60, strengthBonus: 1, farmingLevel: 25, observedMax: 6 },
  { strengthLevel: 68, strengthBonus: 1, farmingLevel: 25, observedMax: 6 },
  { strengthLevel: 69, strengthBonus: 1, farmingLevel: 25, observedMax: 7 },
  { strengthLevel: 77, strengthBonus: 1, farmingLevel: 25, observedMax: 7 },
  { strengthLevel: 78, strengthBonus: 1, farmingLevel: 25, observedMax: 8 },
  { strengthLevel: 86, strengthBonus: 1, farmingLevel: 25, observedMax: 8 },
  { strengthLevel: 87, strengthBonus: 1, farmingLevel: 25, observedMax: 9 },
  { strengthLevel: 95, strengthBonus: 1, farmingLevel: 25, observedMax: 9 },
  { strengthLevel: 96, strengthBonus: 1, farmingLevel: 25, observedMax: 10 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 49, observedMax: 10 },
  { strengthLevel: 12, strengthBonus: 1, farmingLevel: 50, observedMax: 0 },
  { strengthLevel: 13, strengthBonus: 1, farmingLevel: 50, observedMax: 1 },
  { strengthLevel: 21, strengthBonus: 1, farmingLevel: 50, observedMax: 1 },
  { strengthLevel: 22, strengthBonus: 1, farmingLevel: 50, observedMax: 2 },
  { strengthLevel: 29, strengthBonus: 1, farmingLevel: 50, observedMax: 2 },
  { strengthLevel: 30, strengthBonus: 1, farmingLevel: 50, observedMax: 3 },
  { strengthLevel: 38, strengthBonus: 1, farmingLevel: 50, observedMax: 3 },
  { strengthLevel: 39, strengthBonus: 1, farmingLevel: 50, observedMax: 4 },
  { strengthLevel: 46, strengthBonus: 1, farmingLevel: 50, observedMax: 4 },
  { strengthLevel: 47, strengthBonus: 1, farmingLevel: 50, observedMax: 5 },
  { strengthLevel: 55, strengthBonus: 1, farmingLevel: 50, observedMax: 5 },
  { strengthLevel: 56, strengthBonus: 1, farmingLevel: 50, observedMax: 6 },
  { strengthLevel: 63, strengthBonus: 1, farmingLevel: 50, observedMax: 6 },
  { strengthLevel: 64, strengthBonus: 1, farmingLevel: 50, observedMax: 7 },
  { strengthLevel: 72, strengthBonus: 1, farmingLevel: 50, observedMax: 7 },
  { strengthLevel: 73, strengthBonus: 1, farmingLevel: 50, observedMax: 8 },
  { strengthLevel: 81, strengthBonus: 1, farmingLevel: 50, observedMax: 8 },
  { strengthLevel: 82, strengthBonus: 1, farmingLevel: 50, observedMax: 9 },
  { strengthLevel: 89, strengthBonus: 1, farmingLevel: 50, observedMax: 9 },
  { strengthLevel: 90, strengthBonus: 1, farmingLevel: 50, observedMax: 10 },
  { strengthLevel: 98, strengthBonus: 1, farmingLevel: 50, observedMax: 10 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 50, observedMax: 11 },
  { strengthLevel: 11, strengthBonus: 1, farmingLevel: 76, observedMax: 0 },
  { strengthLevel: 12, strengthBonus: 1, farmingLevel: 76, observedMax: 1 },
  { strengthLevel: 19, strengthBonus: 1, farmingLevel: 76, observedMax: 1 },
  { strengthLevel: 20, strengthBonus: 1, farmingLevel: 76, observedMax: 2 },
  { strengthLevel: 27, strengthBonus: 1, farmingLevel: 76, observedMax: 2 },
  { strengthLevel: 28, strengthBonus: 1, farmingLevel: 76, observedMax: 3 },
  { strengthLevel: 35, strengthBonus: 1, farmingLevel: 76, observedMax: 3 },
  { strengthLevel: 36, strengthBonus: 1, farmingLevel: 76, observedMax: 4 },
  { strengthLevel: 43, strengthBonus: 1, farmingLevel: 76, observedMax: 4 },
  { strengthLevel: 44, strengthBonus: 1, farmingLevel: 76, observedMax: 5 },
  { strengthLevel: 51, strengthBonus: 1, farmingLevel: 76, observedMax: 5 },
  { strengthLevel: 52, strengthBonus: 1, farmingLevel: 76, observedMax: 6 },
  { strengthLevel: 59, strengthBonus: 1, farmingLevel: 76, observedMax: 6 },
  { strengthLevel: 60, strengthBonus: 1, farmingLevel: 76, observedMax: 7 },
  { strengthLevel: 66, strengthBonus: 1, farmingLevel: 76, observedMax: 7 },
  { strengthLevel: 68, strengthBonus: 1, farmingLevel: 76, observedMax: 8 },
  { strengthLevel: 75, strengthBonus: 1, farmingLevel: 76, observedMax: 8 },
  { strengthLevel: 76, strengthBonus: 1, farmingLevel: 76, observedMax: 9 },
  { strengthLevel: 83, strengthBonus: 1, farmingLevel: 76, observedMax: 9 },
  { strengthLevel: 84, strengthBonus: 1, farmingLevel: 76, observedMax: 10 },
  { strengthLevel: 91, strengthBonus: 1, farmingLevel: 76, observedMax: 10 },
  { strengthLevel: 92, strengthBonus: 1, farmingLevel: 76, observedMax: 11 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 76, observedMax: 11 },
  { strengthLevel: 100, strengthBonus: 1, farmingLevel: 76, observedMax: 12 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 79, observedMax: 11 },
  { strengthLevel: 11, strengthBonus: 1, farmingLevel: 80, observedMax: 0 },
  { strengthLevel: 12, strengthBonus: 1, farmingLevel: 80, observedMax: 1 },
  { strengthLevel: 19, strengthBonus: 1, farmingLevel: 80, observedMax: 1 },
  { strengthLevel: 20, strengthBonus: 1, farmingLevel: 80, observedMax: 2 },
  { strengthLevel: 27, strengthBonus: 1, farmingLevel: 80, observedMax: 2 },
  { strengthLevel: 28, strengthBonus: 1, farmingLevel: 80, observedMax: 3 },
  { strengthLevel: 35, strengthBonus: 1, farmingLevel: 80, observedMax: 3 },
  { strengthLevel: 36, strengthBonus: 1, farmingLevel: 80, observedMax: 4 },
  { strengthLevel: 43, strengthBonus: 1, farmingLevel: 80, observedMax: 4 },
  { strengthLevel: 44, strengthBonus: 1, farmingLevel: 80, observedMax: 5 },
  { strengthLevel: 51, strengthBonus: 1, farmingLevel: 80, observedMax: 5 },
  { strengthLevel: 52, strengthBonus: 1, farmingLevel: 80, observedMax: 6 },
  { strengthLevel: 59, strengthBonus: 1, farmingLevel: 80, observedMax: 6 },
  { strengthLevel: 60, strengthBonus: 1, farmingLevel: 80, observedMax: 7 },
  { strengthLevel: 67, strengthBonus: 1, farmingLevel: 80, observedMax: 7 },
  { strengthLevel: 68, strengthBonus: 1, farmingLevel: 80, observedMax: 8 },
  { strengthLevel: 75, strengthBonus: 1, farmingLevel: 80, observedMax: 8 },
  { strengthLevel: 76, strengthBonus: 1, farmingLevel: 80, observedMax: 9 },
  { strengthLevel: 82, strengthBonus: 1, farmingLevel: 80, observedMax: 9 },
  { strengthLevel: 83, strengthBonus: 1, farmingLevel: 80, observedMax: 10 },
  { strengthLevel: 90, strengthBonus: 1, farmingLevel: 80, observedMax: 10 },
  { strengthLevel: 91, strengthBonus: 1, farmingLevel: 80, observedMax: 11 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 80, observedMax: 12 },
  { strengthLevel: 7, strengthBonus: 50, farmingLevel: 99, observedMax: 0 },
  { strengthLevel: 8, strengthBonus: 50, farmingLevel: 99, observedMax: 1 },
  { strengthLevel: 11, strengthBonus: 1, farmingLevel: 99, observedMax: 0 },
  { strengthLevel: 12, strengthBonus: 1, farmingLevel: 99, observedMax: 1 },
  { strengthLevel: 13, strengthBonus: 50, farmingLevel: 99, observedMax: 2 },
  { strengthLevel: 17, strengthBonus: 50, farmingLevel: 99, observedMax: 3 },
  { strengthLevel: 19, strengthBonus: 1, farmingLevel: 99, observedMax: 1 },
  { strengthLevel: 20, strengthBonus: 1, farmingLevel: 99, observedMax: 2 },
  { strengthLevel: 22, strengthBonus: 50, farmingLevel: 99, observedMax: 4 },
  { strengthLevel: 26, strengthBonus: 1, farmingLevel: 99, observedMax: 2 },
  { strengthLevel: 27, strengthBonus: 1, farmingLevel: 99, observedMax: 3 },
  { strengthLevel: 27, strengthBonus: 50, farmingLevel: 99, observedMax: 5 },
  { strengthLevel: 32, strengthBonus: 50, farmingLevel: 99, observedMax: 6 },
  { strengthLevel: 33, strengthBonus: 1, farmingLevel: 99, observedMax: 3 },
  { strengthLevel: 34, strengthBonus: 1, farmingLevel: 99, observedMax: 3 },
  { strengthLevel: 37, strengthBonus: 50, farmingLevel: 99, observedMax: 7 },
  { strengthLevel: 41, strengthBonus: 1, farmingLevel: 99, observedMax: 4 },
  { strengthLevel: 42, strengthBonus: 1, farmingLevel: 99, observedMax: 5 },
  { strengthLevel: 49, strengthBonus: 1, farmingLevel: 99, observedMax: 5 },
  { strengthLevel: 50, strengthBonus: 1, farmingLevel: 99, observedMax: 6 },
  { strengthLevel: 57, strengthBonus: 1, farmingLevel: 99, observedMax: 6 },
  { strengthLevel: 58, strengthBonus: 1, farmingLevel: 99, observedMax: 7 },
  { strengthLevel: 64, strengthBonus: 1, farmingLevel: 99, observedMax: 7 },
  { strengthLevel: 65, strengthBonus: 1, farmingLevel: 99, observedMax: 8 },
  { strengthLevel: 72, strengthBonus: 1, farmingLevel: 99, observedMax: 8 },
  { strengthLevel: 73, strengthBonus: 1, farmingLevel: 99, observedMax: 9 },
  { strengthLevel: 79, strengthBonus: 1, farmingLevel: 99, observedMax: 9 },
  { strengthLevel: 80, strengthBonus: 1, farmingLevel: 99, observedMax: 10 },
  { strengthLevel: 87, strengthBonus: 1, farmingLevel: 99, observedMax: 10 },
  { strengthLevel: 88, strengthBonus: 1, farmingLevel: 99, observedMax: 11 },
  { strengthLevel: 95, strengthBonus: 1, farmingLevel: 99, observedMax: 11 },
  { strengthLevel: 96, strengthBonus: 1, farmingLevel: 99, observedMax: 12 },
  { strengthLevel: 99, strengthBonus: 1, farmingLevel: 99, observedMax: 12 },
  { strengthLevel: 99, strengthBonus: 4, farmingLevel: 99, observedMax: 12 },
  { strengthLevel: 99, strengthBonus: 5, farmingLevel: 99, observedMax: 13 },
  { strengthLevel: 99, strengthBonus: 10, farmingLevel: 99, observedMax: 13 },
  { strengthLevel: 99, strengthBonus: 11, farmingLevel: 99, observedMax: 14 },
  { strengthLevel: 99, strengthBonus: 17, farmingLevel: 99, observedMax: 14 },
  { strengthLevel: 99, strengthBonus: 18, farmingLevel: 99, observedMax: 15 },
  { strengthLevel: 99, strengthBonus: 23, farmingLevel: 99, observedMax: 15 },
  { strengthLevel: 99, strengthBonus: 24, farmingLevel: 99, observedMax: 16 },
  { strengthLevel: 99, strengthBonus: 30, farmingLevel: 99, observedMax: 16 },
  { strengthLevel: 99, strengthBonus: 31, farmingLevel: 99, observedMax: 17 },
];
/* eslint-enable object-curly-newline */

const makePlayer = (
  monster: ReturnType<typeof getTestMonsterById>,
  strengthLevel: number,
  strengthBonus: number,
  farmingLevel: number,
) => getTestPlayer(monster, {
  skills: {
    str: strengthLevel,
    farming: farmingLevel,
  },
  equipment: {
    weapon: findEquipment('Magic secateurs'),
  },
  style: {
    name: 'Lunge',
    type: 'stab',
    stance: 'Aggressive',
  },
  bonuses: {
    str: strengthBonus,
  },
});

describe('Tanglefoot', () => {
  describe('calc max hits match observed max hits', () => {
    test.each(testCases)(
      'strength level $strengthLevel, strength bonus $strengthBonus, farming level $farmingLevel',
      ({
        strengthLevel, strengthBonus, farmingLevel, observedMax,
      }) => {
        const monster = getTestMonsterById(5848);
        const player = makePlayer(monster, strengthLevel, strengthBonus, farmingLevel);

        const { maxHit } = calculatePlayerVsNpc(monster, player);
        expect(maxHit).toBe(observedMax);
      },
    );
  });

  test('immune to manual casting with secateurs', () => {
    const monster = getTestMonsterById(5848);
    const player = makePlayer(monster, 99, 1, 99);
    player.style = { name: 'Manual Cast', type: 'magic', stance: 'Manual Cast' };
    player.spell = findSpell('Fire Strike');

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(0);
  });

  test('immune to non-secateur melee', () => {
    const monster = getTestMonsterById(5848);
    const player = makePlayer(monster, 99, 1, 99);
    player.equipment.weapon = findEquipment('Abyssal whip');
    player.style = { name: 'Lash', type: 'slash', stance: 'Controlled' };

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(0);
  });

  test('affected by level boosts', () => {
    const monster = getTestMonsterById(5848);
    const player = makePlayer(monster, 99, 1, 99);
    player.boosts.str = 19;

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(14);
  });

  test('unaffected by prayers', () => {
    const monster = getTestMonsterById(5848);
    const player = makePlayer(monster, 99, 1, 99);
    player.prayers.push(Prayer.PIETY);

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(12);
  });
});
