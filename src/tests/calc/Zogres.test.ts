import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc, findEquipment, findSpell, getTestMonster, getTestPlayer,
} from '@/tests/utils/TestUtils';
import { Player } from '@/types/Player';

describe('Zogre damage resistances', () => {
  const m = getTestMonster('Zogre', '');

  test('Regular damage is reduced by 1/4', () => {
    const p = getTestPlayer(m, {
      bonuses: {
        str: 125, // gives 32 max hit
      },
    });
    const { maxHit } = calculatePlayerVsNpc(m, p);
    expect(maxHit).toBe(8);

    const withArrows: Player = {
      ...p,
      equipment: {
        ...p.equipment,
        ammo: findEquipment('Adamant brutal'),
      },
    };
    const maxHitWithArrows = calculatePlayerVsNpc(m, withArrows).maxHit;
    expect(maxHitWithArrows).toBe(8);
  });

  test('Crumble undead is reduced by 1/2', () => {
    const p = getTestPlayer(m, {
      style: {
        type: 'magic',
        stance: 'Manual Cast',
      },
      bonuses: {
        magic_str: 1250, // gives 32 max hit
      },
      spell: findSpell('Crumble Undead'),
    });

    const { maxHit } = calculatePlayerVsNpc(m, p);
    expect(maxHit).toBe(16);

    const withArrows: Player = {
      ...p,
      equipment: {
        ...p.equipment,
        ammo: findEquipment('Adamant brutal'),
      },
    };
    const maxHitWithArrows = calculatePlayerVsNpc(m, withArrows).maxHit;
    expect(maxHitWithArrows).toBe(16);
  });

  test('Brutal arrows apply full damage', () => {
    const { maxHit } = calculatePlayerVsNpc(m, getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Comp ogre bow'),
        ammo: findEquipment('Adamant brutal'),
      },
      style: {
        type: 'ranged',
        stance: 'Rapid',
      },
      bonuses: {
        ranged_str: 125, // gives 32 max hit
      },
    }));
    expect(maxHit).toBe(32);
  });

  test('Brutal arrows do not skip damage reduction when not used', () => {
    const { maxHit } = calculatePlayerVsNpc(m, getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Bow of faerdhinen (c)'),
        ammo: findEquipment('Adamant brutal'),
      },
      style: {
        type: 'ranged',
        stance: 'Rapid',
      },
      bonuses: {
        ranged_str: 125, // gives 32 max hit
      },
    }));
    expect(maxHit).toBe(8);
  });
});
