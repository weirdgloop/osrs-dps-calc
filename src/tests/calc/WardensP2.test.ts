import { expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc,
  findEquipment,
  findResult,
  getTestMonster,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { DetailKey } from '@/lib/CalcDetails';
import { getCombatStylesForCategory } from '@/utils';
import { EquipmentCategory } from '@/enums/EquipmentCategory';

// MAR, base max, lowest seen, max hit
// thank you @jmyaeger!!!
const CASES = [
  [57798, 50, 21, 30],
  [58539, 51, 21, -1],
  [8132, 19, 3, 6],
  [23562, 24, 6, 11],
  [39643, 34, 12, -1],
  [39504, 34, 11, -1],
  [19153, 28, 6, 12],
  [21576, 31, 7, 13],
  [24012, 32, 9, 14],
  [24360, 32, 8, 14],
  [22919, 29, 7, 13],
  [30270, 32, 9, 16],
  [29546, 30, 8, 14],
  [35004, 45, 14, 23],
  [36166, 46, 15, 24],
  [38237, 39, 13, 21],
  [37185, 41, 13, 22],
  [58333, 51, 20, 30],
];

CASES.forEach(([mar, baseMax, lowest, max]) => {
  test(`MAR=${mar} baseMax=${baseMax}`, () => {
    const m = getTestMonster("Elidinis' Warden");
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Magic shortbow'),
        ammo: findEquipment('Amethyst arrow'),
      },
      bonuses: {
        // baseMax = (effectiveLevel * gearBonus + 320) / 640
        ranged_str: Math.trunc(((baseMax * 640) - 320) / 107) - 63,
      },
      style: getCombatStylesForCategory(EquipmentCategory.BOW)[1],
    });

    const { dist, details } = calculatePlayerVsNpc(m, p, {
      overrides: {
        attackRoll: mar,
      },
    });

    // if this is wrong the ranged_str above is not correct
    expect(findResult(details, DetailKey.MAX_HIT_BASE)).toBe(baseMax);

    expect(dist.getMin()).toBeLessThanOrEqual(lowest);
    if (max !== -1) {
      expect(dist.getMax()).toBe(max);
    }
  });
});
