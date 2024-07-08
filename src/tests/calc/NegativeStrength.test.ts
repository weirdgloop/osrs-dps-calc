import { describe, test, expect } from '@jest/globals';
import { getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';

describe('setups with hugely negative bonuses should not return negative max hits', () => {
  test('melee', () => {
    const m = getTestMonster();
    const p = getTestPlayer(m, {
      bonuses: {
        str: -1000,
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    const [min, max] = calc.getMinAndMax();
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeGreaterThanOrEqual(0);
  });

  test('ranged', () => {
    const m = getTestMonster();
    const p = getTestPlayer(m, {
      bonuses: {
        ranged_str: -1000,
      },
      style: {
        type: 'ranged',
        stance: 'Rapid',
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    const [min, max] = calc.getMinAndMax();
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeGreaterThanOrEqual(0);
  });

  test('magic', () => {
    const m = getTestMonster();
    const p = getTestPlayer(m, {
      bonuses: {
        ranged_str: -1000,
      },
      style: {
        type: 'magic',
        stance: 'Accurate',
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    const [min, max] = calc.getMinAndMax();
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeGreaterThanOrEqual(0);
  });
});
