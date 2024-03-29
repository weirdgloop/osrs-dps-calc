import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc, findEquipment, getTestMonsterById, getTestPlayer,
} from '@/tests/utils/TestUtils';
import { Prayer } from '@/enums/Prayer';
import { Player } from '@/types/Player';
import { PartialDeep } from 'type-fest';

const monster = getTestMonsterById(415);
const basePlayer: PartialDeep<Player> = {
  prayers: [Prayer.PIETY],
  style: {
    name: 'Hack',
    type: 'slash',
    stance: 'Aggressive',
  },
  equipment: {
    weapon: findEquipment('Soulreaper axe'),
  },
};

describe('Soulreaper axe', () => {
  describe('Level 118, Gear bonus 188', () => {
    [
      [0, 61],
      [1, 64],
      [2, 67],
      [3, 70],
      [4, 72],
      [5, 75],
    ].forEach(([stacks, max]) => {
      test(`${stacks} stacks`, () => {
        const player = getTestPlayer(monster, {
          ...basePlayer,
          skills: {
            str: 118,
          },
          bonuses: {
            str: 188,
          },
          buffs: {
            soulreaperStacks: stacks,
          },
        });

        const { maxHit } = calculatePlayerVsNpc(monster, player);
        expect(maxHit).toBe(max);
      });
    });
  });

  describe('Level 99, Gear bonus 188', () => {
    test('5 stacks', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        skills: {
          str: 99,
        },
        bonuses: {
          str: 188,
        },
        buffs: {
          soulreaperStacks: 5,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(63);
    });
  });
});
