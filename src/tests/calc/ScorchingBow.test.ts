import { expect, test } from '@jest/globals';
import { findEquipment, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';

test('applies no bonus against non-demons', () => {
  const m = getTestMonster('Aberrant spectre');
  const p = getTestPlayer(m, {
    equipment: {
      weapon: findEquipment('Scorching bow'),
      ammo: findEquipment('Dragon arrow'),
    },
    skills: {
      ranged: 99,
    },
    bonuses: {
      ranged_str: 100,
    },
    style: {
      name: 'Rapid',
      type: 'ranged',
      stance: 'Rapid',
    },
  });

  const baseMax = Math.trunc(((99 + 8) * (100 + 64) + 320) / 640);

  const calc = new PlayerVsNPCCalc(p, m);
  expect(calc.getMax()).toBe(baseMax);
});

test('applies 30% bonus against demons', () => {
  const m = getTestMonster('Abyssal demon', 'Standard');
  const p = getTestPlayer(m, {
    equipment: {
      weapon: findEquipment('Scorching bow'),
      ammo: findEquipment('Dragon arrow'),
    },
    skills: {
      ranged: 99,
    },
    bonuses: {
      ranged_str: 100,
    },
    style: {
      name: 'Rapid',
      type: 'ranged',
      stance: 'Rapid',
    },
  });

  const baseMax = Math.trunc(((99 + 8) * (100 + 64) + 320) / 640);

  const calc = new PlayerVsNPCCalc(p, m);
  expect(calc.getMax()).toBe(Math.trunc(baseMax * 13 / 10));
});

test('is additive with slayer helm', () => {
  const m = getTestMonster('Abyssal demon', 'Standard');
  const p = getTestPlayer(m, {
    equipment: {
      head: findEquipment('Slayer helmet (i)'),
      weapon: findEquipment('Scorching bow'),
      ammo: findEquipment('Dragon arrow'),
    },
    skills: {
      ranged: 99,
    },
    bonuses: {
      ranged_str: 100,
    },
    style: {
      name: 'Rapid',
      type: 'ranged',
      stance: 'Rapid',
    },
    buffs: {
      onSlayerTask: true,
    },
  });

  const baseMax = Math.trunc(((99 + 8) * (100 + 64) + 320) / 640);

  const calc = new PlayerVsNPCCalc(p, m);
  expect(calc.getMax()).toBe(Math.trunc(baseMax * 29 / 20));
  expect(calc.getMax()).not.toBe(Math.trunc(Math.trunc(baseMax * 23 / 20)) * 13 / 10);
});
