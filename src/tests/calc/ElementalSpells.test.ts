import {
  describe,
  expect,
  test,
} from '@jest/globals';
import {
  calculatePlayerVsNpc,
  findEquipmentById,
  findSpell,
  getTestMonster,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { PartialDeep } from 'type-fest';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';

describe('Elemental spell max hits', () => {
  const basePlayer: PartialDeep<Player> = {
    style: {
      name: 'Autocast',
      type: 'magic',
      stance: 'Autocast',
    },
    spell: findSpell('Wind Strike'),
  };

  const testCases = [
    {
      name: 'level 1, no elemental weakness',
      magic: 1,
      weakness: null,
      equipment: {},
      expected: 2,
    },
    {
      name: 'level 1, 100% air elemental weakness',
      magic: 1,
      weakness: {
        element: 'air',
        severity: 100,
      },
      equipment: {},
      expected: 4,
    },
    {
      name: 'level 99, no elemental weakness',
      magic: 99,
      weakness: null,
      equipment: {},
      expected: 8,
    },
    {
      name: 'level 99, 100% air elemental weakness',
      magic: 99,
      weakness: {
        element: 'air',
        severity: 100,
      },
      equipment: {},
      expected: 16,
    },
    {
      name: 'level 99 with Amulet of air, no elemental weakness',
      magic: 99,
      weakness: null,
      equipment: {
        neck: findEquipmentById(34407),
      },
      expected: 10,
    },
    {
      name: 'level 99 with Amulet of air, 100% air elemental weakness',
      magic: 99,
      weakness: {
        element: 'air',
        severity: 100,
      },
      equipment: {
        neck: findEquipmentById(34407),
      },
      expected: 20,
    },
    {
      name: 'level 99 with Elemental amulet, no elemental weakness',
      magic: 99,
      weakness: null,
      equipment: {
        neck: findEquipmentById(34428),
      },
      expected: 10,
    },
    {
      name: 'level 99 with Elemental amulet, 100% air elemental weakness',
      magic: 99,
      weakness: {
        element: 'air',
        severity: 100,
      },
      equipment: {
        neck: findEquipmentById(34428),
      },
      expected: 20,
    },
  ] satisfies {
    name: string;
    magic: number;
    weakness: Monster['weakness'];
    equipment: PartialDeep<Player['equipment']>;
    expected: number;
  }[];

  test.each(testCases)('$name', ({
    magic,
    weakness,
    equipment,
    expected,
  }) => {
    const monster = getTestMonster('Abyssal demon', 'Standard', {
      weakness,
    });

    const player = getTestPlayer(monster, {
      ...basePlayer,
      skills: {
        magic,
      },
      equipment,
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(expected);
  });
});
