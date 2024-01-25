import { describe, expect, test } from '@jest/globals';
import {
  calculate,
  findEquipmentById,
  getTestMonsterById,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { Prayer } from '@/enums/Prayer';

describe('Duke demonbane', () => {
  test('max melee bellator', () => {
    const monster = getTestMonsterById(12191);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Slash',
        type: 'slash',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(28254),
        cape: findEquipmentById(21295),
        neck: findEquipmentById(24780),
        ammo: findEquipmentById(22947),
        weapon: findEquipmentById(19675),
        body: findEquipmentById(28256),
        shield: findEquipmentById(27550),
        legs: findEquipmentById(28258),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(28316),
      },
    });

    const { maxHit } = calculate(player, monster);
    expect(maxHit).toBe(50);
  });
});
