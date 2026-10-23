import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc,
  findEquipmentById,
  getTestMonsterById,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { Prayer } from '@/enums/Prayer';

describe('Vyrewatch sentinel', () => {
  test('blisterwood stakes with efaritay\'s aid', () => {
    const monster = getTestMonsterById(9756);
    const player = getTestPlayer(monster, {
      skills: {
        ranged: 112,
      },
      prayers: [Prayer.DEADEYE],
      style: {
        name: 'Rapid',
        type: 'ranged',
        stance: 'Rapid',
      },
      equipment: {
        head: findEquipmentById(11664),
        cape: findEquipmentById(22109),
        neck: findEquipmentById(19547),
        weapon: findEquipmentById(33716),
        body: findEquipmentById(13072),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(19933),
        ring: findEquipmentById(21140),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(28);
  });
  test('blisterwood stakes without efaritay\'s aid', () => {
    const monster = getTestMonsterById(9756);
    const player = getTestPlayer(monster, {
      skills: {
        ranged: 112,
      },
      prayers: [Prayer.DEADEYE],
      style: {
        name: 'Rapid',
        type: 'ranged',
        stance: 'Rapid',
      },
      equipment: {
        head: findEquipmentById(11664),
        cape: findEquipmentById(22109),
        neck: findEquipmentById(19547),
        weapon: findEquipmentById(33716),
        body: findEquipmentById(13072),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(19933),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(26);
  });
  test('hallowed flail with efaritay\'s aid', () => {
    const monster = getTestMonsterById(9756);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 105,
        str: 118,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Chop',
        type: 'slash',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(29028),
        cape: findEquipmentById(21295),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(33718),
        body: findEquipmentById(29022),
        shield: findEquipmentById(12954),
        legs: findEquipmentById(29025),
        hands: findEquipmentById(7462),
        feet: findEquipmentById(11840),
        ring: findEquipmentById(21140),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(51);
  });
  test('hallowed flail without efaritay\'s aid', () => {
    const monster = getTestMonsterById(9756);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 105,
        str: 118,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Chop',
        type: 'slash',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(29028),
        cape: findEquipmentById(21295),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(33718),
        body: findEquipmentById(29022),
        shield: findEquipmentById(12954),
        legs: findEquipmentById(29025),
        hands: findEquipmentById(7462),
        feet: findEquipmentById(11840),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(47);
  });
});
