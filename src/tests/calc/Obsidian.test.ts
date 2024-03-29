import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc,
  findEquipment,
  getTestMonster,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { Prayer } from '@/enums/Prayer';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { PartialDeep } from 'type-fest';
import { Player, PlayerEquipment } from '@/types/Player';

describe('Toktz-ket-xil', () => {
  const monster = getTestMonster('Abyssal demon', 'Standard', {
    attributes: [MonsterAttribute.UNDEAD],
  });
  const basePlayer: PartialDeep<Player> = {
    prayers: [Prayer.PIETY],
    style: {
      stance: 'Accurate',
      type: 'stab',
    },
    bonuses: {
      str: 72,
    },
  };
  const toktzXilAk: Partial<PlayerEquipment> = {
    weapon: findEquipment('Toktz-xil-ak'),
  };
  const obsidianArmor: Partial<PlayerEquipment> = {
    head: findEquipment('Obsidian helmet'),
    body: findEquipment('Obsidian platebody'),
    legs: findEquipment('Obsidian platelegs'),
  };
  const salveAmulet: Partial<PlayerEquipment> = {
    neck: findEquipment('Salve amulet(ei)'),
  };
  const berserkerNecklace: Partial<PlayerEquipment> = {
    neck: findEquipment('Berserker necklace'),
  };

  // as of 2024-01-22, 103 str is the max achievable with salve and obsidian
  describe('level 99 // bonus 103', () => {
    const player103 = {
      ...basePlayer,
      bonuses: {
        str: 103,
      },
    };

    test('base max', () => {
      const player = getTestPlayer(monster, {
        ...player103,
        equipment: {
          ...toktzXilAk,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(34);
    });

    test('with obsidian armour set', () => {
      const player = getTestPlayer(monster, {
        ...player103,
        equipment: {
          ...toktzXilAk,
          ...obsidianArmor,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(37);
    });

    test('with salve (ei)', () => {
      const player = getTestPlayer(monster, {
        ...player103,
        equipment: {
          ...toktzXilAk,
          ...salveAmulet,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(40);
    });

    test('with obsidian armour set and salve (ei)', () => {
      const player = getTestPlayer(monster, {
        ...player103,
        equipment: {
          ...toktzXilAk,
          ...obsidianArmor,
          ...salveAmulet,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(43);
    });

    test('with berserker necklace', () => {
      const player = getTestPlayer(monster, {
        ...player103,
        equipment: {
          ...toktzXilAk,
          ...berserkerNecklace,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(40);
    });

    test('with obsidian armour set and berserker necklace', () => {
      const player = getTestPlayer(monster, {
        ...player103,
        equipment: {
          ...toktzXilAk,
          ...obsidianArmor,
          ...berserkerNecklace,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(44);
    });
  });

  // we had a miscalc at 72 str due to order of operations, so test for it specifically
  describe('level 99 // bonus 72', () => {
    const player72 = {
      ...basePlayer,
      bonuses: {
        str: 72,
      },
    };

    test('base max', () => {
      const player = getTestPlayer(monster, {
        ...player72,
        equipment: {
          ...toktzXilAk,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(27);
    });

    test('with obsidian armour set', () => {
      const player = getTestPlayer(monster, {
        ...player72,
        equipment: {
          ...toktzXilAk,
          ...obsidianArmor,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(29);
    });

    test('with salve (ei)', () => {
      const player = getTestPlayer(monster, {
        ...player72,
        equipment: {
          ...toktzXilAk,
          ...salveAmulet,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(32);
    });

    test('with obsidian armour set and salve (ei)', () => {
      const player = getTestPlayer(monster, {
        ...player72,
        equipment: {
          ...toktzXilAk,
          ...obsidianArmor,
          ...salveAmulet,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(34);
    });

    test('with berserker necklace', () => {
      const player = getTestPlayer(monster, {
        ...player72,
        equipment: {
          ...toktzXilAk,
          ...berserkerNecklace,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(32);
    });

    test('with obsidian armour set and berserker necklace', () => {
      const player = getTestPlayer(monster, {
        ...player72,
        equipment: {
          ...toktzXilAk,
          ...obsidianArmor,
          ...berserkerNecklace,
        },
      });

      const { maxHit } = calculatePlayerVsNpc(monster, player);
      expect(maxHit).toBe(34);
    });
  });
});
