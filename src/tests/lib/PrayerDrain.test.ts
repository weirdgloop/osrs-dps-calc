import { describe, expect, test } from '@jest/globals';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import { Prayer } from '@/enums/Prayer';

describe('getPrayerTicks', () => {
  test('no prayers lasts forever', () => {
    const m = getTestMonster('Abyssal demon', 'Standard');
    const p = getTestPlayer(m, {
      bonuses: {
        prayer: 0,
      },
      prayers: [],
    });
    const calc = new PlayerVsNPCCalc(p, m);

    expect(calc.getPrayerTicks()).toBe(Infinity);
    expect(calc.getPrayerDuration()).toBe(Infinity);
  });

  test('0 prayer bonus 99 prayer piety', () => {
    const m = getTestMonster('Abyssal demon', 'Standard');
    const p = getTestPlayer(m, {
      bonuses: {
        prayer: 0,
      },
      prayers: [
        Prayer.PIETY,
      ],
    });
    const calc = new PlayerVsNPCCalc(p, m);

    expect(calc.getPrayerTicks()).toBe(248);
    expect(calc.getPrayerDuration()).toBeCloseTo(148.8);
  });

  test('30 prayer 99 prayer bonus piety', () => {
    const m = getTestMonster('Abyssal demon', 'Standard');
    const p = getTestPlayer(m, {
      bonuses: {
        prayer: 30,
      },
      prayers: [
        Prayer.PIETY,
      ],
    });
    const calc = new PlayerVsNPCCalc(p, m);

    expect(calc.getPrayerTicks()).toBe(495);
    expect(calc.getPrayerDuration()).toBeCloseTo(297);
  });

  test('15 prayer bonus 99 prayer steel skin and superhuman strength and improved reflexes', () => {
    const m = getTestMonster('Abyssal demon', 'Standard');
    const p = getTestPlayer(m, {
      bonuses: {
        prayer: 15,
      },
      prayers: [
        Prayer.STEEL_SKIN,
        Prayer.SUPERHUMAN_STRENGTH,
        Prayer.IMPROVED_REFLEXES,
      ],
    });
    const calc = new PlayerVsNPCCalc(p, m);

    expect(calc.getPrayerTicks()).toBe(372);
    expect(calc.getPrayerDuration()).toBeCloseTo(223.2);
  });
});
