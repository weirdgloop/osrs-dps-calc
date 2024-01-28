import {
  describe,
  expect,
  test,
} from '@jest/globals';
import {
  calculate,
  findEquipment,
  findSpell,
  getTestMonster,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { PartialDeep } from 'type-fest';
import { Player } from '@/types/Player';

describe('Demonbane spells', () => {
  const monster = getTestMonster('Abyssal demon', 'Standard');
  const basePlayer: PartialDeep<Player> = {
    style: {
      name: 'Autocast',
      type: 'magic',
      stance: 'Autocast',
    },
    equipment: {
      weapon: findEquipment('Staff of fire'),
    },
  };

  describe('Dark demonbane', () => {
    test('Without Mark of Darkness', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        spell: findSpell('Dark Demonbane'),
      });

      const { maxHit } = calculate(monster, player);
      expect(maxHit).toBe(30);
    });

    test('With Mark of Darkness', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        spell: findSpell('Dark Demonbane'),
        buffs: {
          markOfDarknessSpell: true,
        },
      });

      const { maxHit } = calculate(monster, player);
      expect(maxHit).toBe(37);
    });
  });

  describe('Superior demonbane', () => {
    test('Without Mark of Darkness', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        spell: findSpell('Superior Demonbane'),
      });

      const { maxHit } = calculate(monster, player);
      expect(maxHit).toBe(23);
    });

    test('With Mark of Darkness', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        spell: findSpell('Superior Demonbane'),
        buffs: {
          markOfDarknessSpell: true,
        },
      });

      const { maxHit } = calculate(monster, player);
      expect(maxHit).toBe(28);
    });
  });

  describe('Inferior demonbane', () => {
    test('Without Mark of Darkness', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        spell: findSpell('Inferior Demonbane'),
      });

      const { maxHit } = calculate(monster, player);
      expect(maxHit).toBe(16);
    });

    test('With Mark of Darkness', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        spell: findSpell('Inferior Demonbane'),
        buffs: {
          markOfDarknessSpell: true,
        },
      });

      const { maxHit } = calculate(monster, player);
      expect(maxHit).toBe(20);
    });
  });
});
