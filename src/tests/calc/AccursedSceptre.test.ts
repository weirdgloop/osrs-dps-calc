import { describe, expect, test } from '@jest/globals';
import {
  findEquipment, findSpell, getTestMonster, getTestPlayer,
} from '@/tests/utils/TestUtils';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { getSpellMaxHit } from '@/types/Spell';

const m = getTestMonster();
const expectedSpecMax99 = 40;

describe('Accursed sceptre (a)', () => {
  test('should not use the built-in spell when autocasting', () => {
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Accursed sceptre (a)'),
      },
      style: {
        type: 'magic',
        name: 'Autocast',
        stance: 'Autocast',
      },
      spell: findSpell('Water Strike'),
      skills: {
        magic: 99,
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getMax()).toBe(getSpellMaxHit(findSpell('Water Strike'), 99));
  });

  test('should not use the built-in spell when manual casting', () => {
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Accursed sceptre (a)'),
      },
      style: {
        type: 'magic',
        name: 'Manual Cast',
        stance: 'Manual Cast',
      },
      spell: findSpell('Water Strike'),
      skills: {
        magic: 99,
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getMax()).toBe(getSpellMaxHit(findSpell('Water Strike'), 99));
  });

  test('should not use the built-in spell when using melee style', () => {
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Accursed sceptre (a)'),
      },
      style: {
        type: 'crush',
        name: 'Pound',
        stance: 'Aggressive',
      },
      skills: {
        str: 99,
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getMax()).toBe(11);
  });

  test('should use the built-in spell when special attacking on auto cast', () => {
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Accursed sceptre (a)'),
      },
      style: {
        type: 'magic',
        name: 'Manual Cast',
        stance: 'Manual Cast',
      },
      spell: findSpell('Water Strike'),
      skills: {
        magic: 99,
      },
    });

    const calc = new PlayerVsNPCCalc(p, m, { usingSpecialAttack: true });
    expect(calc.getMax()).toBe(expectedSpecMax99);
  });

  test('should use the built-in spell when special attacking on manual cast', () => {
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Accursed sceptre (a)'),
      },
      style: {
        type: 'magic',
        name: 'Manual Cast',
        stance: 'Manual Cast',
      },
      spell: findSpell('Water Strike'),
      skills: {
        magic: 99,
      },
    });

    const calc = new PlayerVsNPCCalc(p, m, { usingSpecialAttack: true });
    expect(calc.getMax()).toBe(expectedSpecMax99);
  });

  test('should use the built-in spell when special attacking on melee style', () => {
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Accursed sceptre (a)'),
      },
      style: {
        type: 'magic',
        name: 'Manual Cast',
        stance: 'Manual Cast',
      },
      spell: findSpell('Water Strike'),
      skills: {
        magic: 99,
      },
    });

    const calc = new PlayerVsNPCCalc(p, m, { usingSpecialAttack: true });
    expect(calc.getMax()).toBe(expectedSpecMax99);
  });
});
