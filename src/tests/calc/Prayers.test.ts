import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc, findEquipmentById,
  getTestMonster,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { DetailKey } from '@/lib/CalcDetails';
import { Prayer } from '@/enums/Prayer';
import { PartialDeep } from 'type-fest';
import { Player } from '@/types/Player';

describe('Prayers', () => {
  const monster = getTestMonster('Abyssal demon', 'Standard');

  describe('Burst of Strength', () => {
    const basePlayer: PartialDeep<Player> = { prayers: [Prayer.BURST_OF_STRENGTH] };

    test('level 10 strength', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        skills: { str: 10 },
      });
      const { details } = calculatePlayerVsNpc(monster, player);
      expect(details.find((d) => d.label === DetailKey.DAMAGE_LEVEL_PRAYER)?.value).toBe(11);
    });

    test('level 99 strength', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        skills: { str: 99 },
      });
      const { details } = calculatePlayerVsNpc(monster, player);
      expect(details.find((d) => d.label === DetailKey.DAMAGE_LEVEL_PRAYER)?.value).toBe(103);
    });
  });

  describe('Sharp Eye', () => {
    const basePlayer: PartialDeep<Player> = {
      prayers: [Prayer.SHARP_EYE],
      equipment: {
        weapon: findEquipmentById(21902),
        ammo: findEquipmentById(21905),
      },
      style: {
        name: 'Rapid',
        type: 'ranged',
        stance: 'Rapid',
      },
    };

    test('level 10 ranged', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        skills: { ranged: 10 },
      });
      const { details } = calculatePlayerVsNpc(monster, player);
      expect(details.find((d) => d.label === DetailKey.DAMAGE_LEVEL_PRAYER)?.value).toBe(11);
    });

    test('level 99 ranged', () => {
      const player = getTestPlayer(monster, {
        ...basePlayer,
        skills: { ranged: 99 },
      });
      const { details } = calculatePlayerVsNpc(monster, player);
      expect(details.find((d) => d.label === DetailKey.DAMAGE_LEVEL_PRAYER)?.value).toBe(103);
    });
  });
});
