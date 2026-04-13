import { describe, expect, test } from '@jest/globals';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { DetailKey } from '@/lib/CalcDetails';
import {
  findEquipment,
  findResult,
  getTestMonster,
  getTestPlayer,
} from '@/tests/utils/TestUtils';

const getMinionDpt = (calc: PlayerVsNPCCalc): number => calc.getDpt() - (calc.getExpectedDamage() / calc.getExpectedAttackSpeed());

describe('Minion', () => {
  test('chooses the weaker of ranged or magic defences', () => {
    const m = getTestMonster('Abyssal demon', 'Standard', {
      defensive: {
        light: 220,
        standard: 220,
        heavy: 220,
        magic: -20,
      },
    });
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Bronze dagger'),
      },
      leagues: {
        six: {
          minionEnabled: true,
          minionZamorakItemCount: 0,
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m, { detailedOutput: true });
    calc.getDps();

    expect(findResult(calc.details, DetailKey.LEAGUES_MINION_STYLE)).toBe('magic');
  });

  test('gains max hit from consumed Zamorak items', () => {
    const m = getTestMonster('Abyssal demon', 'Standard');
    const playerOverrides = {
      equipment: {
        weapon: findEquipment('Bronze dagger'),
      },
      leagues: {
        six: {
          minionEnabled: true,
        },
      },
    };

    const baseCalc = new PlayerVsNPCCalc(getTestPlayer(m, {
      ...playerOverrides,
      leagues: {
        six: {
          ...playerOverrides.leagues.six,
          minionZamorakItemCount: 0,
        },
      },
    }), m, { detailedOutput: true });
    baseCalc.getDps();

    const upgradedCalc = new PlayerVsNPCCalc(getTestPlayer(m, {
      ...playerOverrides,
      leagues: {
        six: {
          ...playerOverrides.leagues.six,
          minionZamorakItemCount: 5,
        },
      },
    }), m, { detailedOutput: true });
    upgradedCalc.getDps();

    expect(findResult(baseCalc.details, DetailKey.LEAGUES_MINION_MAX_HIT)).toBe(10);
    expect(findResult(upgradedCalc.details, DetailKey.LEAGUES_MINION_MAX_HIT)).toBe(20);
    expect(upgradedCalc.getDps()).toBeGreaterThan(baseCalc.getDps());
  });

  test('does not inherit player bolt effects', () => {
    const m = getTestMonster('Abyssal demon', 'Standard');
    const neutralCalc = new PlayerVsNPCCalc(getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Bronze dagger'),
      },
      leagues: {
        six: {
          minionEnabled: true,
          minionZamorakItemCount: 0,
        },
      },
    }), m);

    const boltCalc = new PlayerVsNPCCalc(getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Rune crossbow'),
        ammo: findEquipment('Ruby bolts (e)'),
      },
      leagues: {
        six: {
          minionEnabled: true,
          minionZamorakItemCount: 0,
        },
      },
    }), m);

    expect(getMinionDpt(boltCalc)).toBeCloseTo(getMinionDpt(neutralCalc));
  });
});