import { expect, test, describe } from '@jest/globals';
import { findEquipment, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import { getCombatStylesForCategory } from '@/utils';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';

describe('with inq mace', () => {
  test('gets 2.5% per piece', () => {
    const m = getTestMonster("Phosani's Nightmare");
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment("Inquisitor's mace"),
        body: findEquipment("Inquisitor's hauberk"),
        legs: findEquipment("Inquisitor's plateskirt"),
      },
      style: getCombatStylesForCategory(EquipmentCategory.BLUNT)[1],
      bonuses: {
        str: 1100, // base max hit of 200
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getMax()).toBe(210);
  });

  test('does not gain a bonus 1% for full set', () => {
    const m = getTestMonster("Phosani's Nightmare");
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment("Inquisitor's mace"),
        head: findEquipment("Inquisitor's great helm"),
        body: findEquipment("Inquisitor's hauberk"),
        legs: findEquipment("Inquisitor's plateskirt"),
      },
      style: getCombatStylesForCategory(EquipmentCategory.BLUNT)[1],
      bonuses: {
        str: 1100, // base max hit of 200
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getMax()).toBe(215);
  });
});

describe('with other weapons', () => {
  test('gets .5% per piece', () => {
    const m = getTestMonster("Phosani's Nightmare");
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Dragon warhammer'),
        body: findEquipment("Inquisitor's hauberk"),
        legs: findEquipment("Inquisitor's plateskirt"),
      },
      style: getCombatStylesForCategory(EquipmentCategory.BLUNT)[1],
      bonuses: {
        str: 1100, // base max hit of 200
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getMax()).toBe(202);
  });

  test('gets bonus 1% per ', () => {
    const m = getTestMonster("Phosani's Nightmare");
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Dragon warhammer'),
        head: findEquipment("Inquisitor's great helm"),
        body: findEquipment("Inquisitor's hauberk"),
        legs: findEquipment("Inquisitor's plateskirt"),
      },
      style: getCombatStylesForCategory(EquipmentCategory.BLUNT)[1],
      bonuses: {
        str: 1100, // base max hit of 200
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getMax()).toBe(205);
  });
});
