import { expect, test, describe } from '@jest/globals';
import {
  AttackDistribution, HitDistribution, Hitsplat, WeightedHit,
} from '@/lib/HitDist';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';

describe('variable attack speeds should not merge states from different timelines', () => {
  test('2hp, 50% accuracy, 3:4 guarantee, 1 max', () => {
    const dist = new AttackDistribution([new HitDistribution([
      new WeightedHit(0.5, [Hitsplat.INACCURATE]),
      new WeightedHit(0.5, [new Hitsplat(1)]),
    ])]);

    const m = getTestMonster('Abyssal demon', 'Standard', {
      skills: {
        hp: 2,
      },
    });
    const p = getTestPlayer(m);
    const calc = new PlayerVsNPCCalc(p, m);
    calc.getDistribution = () => dist;
    calc.getWeaponDelayProvider = () => (wh) => (wh.anyAccurate() ? [[1.0, 3]] : [[1.0, 4]]);

    const result = calc.getTtkDistribution();
    expect(result.get(4))
      .toBeCloseTo(0.2500323);
    expect(result.get(8))
      .toBeCloseTo(0.2499614);
    expect(result.get(12))
      .toBeCloseTo(0.1875178);
    expect(result.get(16))
      .toBeCloseTo(0.1250477);
    expect(result.get(20))
      .toBeCloseTo(0.0781260);
    expect(result.get(24))
      .toBeCloseTo(0.0468598);
    expect(result.get(28))
      .toBeCloseTo(0.0273283);
    expect(result.get(32))
      .toBeCloseTo(0.0156107);
  });

  test('3hp, 50% accuracy, 3:4 guarantee, 1 max', () => {
    const dist = new AttackDistribution([new HitDistribution([
      new WeightedHit(0.5, [Hitsplat.INACCURATE]),
      new WeightedHit(0.5, [new Hitsplat(1)]),
    ])]);

    const m = getTestMonster('Abyssal demon', 'Standard', {
      skills: {
        hp: 3,
      },
    });
    const p = getTestPlayer(m);
    const calc = new PlayerVsNPCCalc(p, m);
    calc.getDistribution = () => dist;
    calc.getWeaponDelayProvider = () => (wh) => (wh.anyAccurate() ? [[1.0, 3]] : [[1.0, 4]]);

    const result = calc.getTtkDistribution();
    expect(result.get(7))
      .toBeCloseTo(0.1252002);
    expect(result.get(11))
      .toBeCloseTo(0.1873703);
    expect(result.get(15))
      .toBeCloseTo(0.1875431);
    expect(result.get(19))
      .toBeCloseTo(0.1563541);
    expect(result.get(23))
      .toBeCloseTo(0.1172253);
    expect(result.get(27))
      .toBeCloseTo(0.0819964);
    expect(result.get(31))
      .toBeCloseTo(0.0545925);
    expect(result.get(35))
      .toBeCloseTo(0.0351271);
    expect(result.get(39))
      .toBeCloseTo(0.0219353);
    expect(result.get(43))
      .toBeCloseTo(0.0134112);
    expect(result.get(47))
      .toBeCloseTo(0.0080274);
    expect(result.get(51))
      .toBeCloseTo(0.0047513);
    expect(result.get(55))
      .toBeCloseTo(0.0027831);
    expect(result.get(59))
      .toBeCloseTo(0.0015817);
    expect(result.get(63))
      .toBeCloseTo(0.0009203);
    expect(result.get(67))
      .toBeCloseTo(0.0005095);
    expect(result.get(71))
      .toBeCloseTo(0.000301);
    expect(result.get(75))
      .toBeCloseTo(0.0001695);
    expect(result.get(79))
      .toBeCloseTo(9.25e-05);
    expect(result.get(83))
      .toBeCloseTo(4.99e-05);
    expect(result.get(83))
      .toBeCloseTo(2.64e-05);
  });
});
