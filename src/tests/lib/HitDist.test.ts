import { expect, test, describe } from '@jest/globals';
import { HitDistribution, Hitsplat, WeightedHit } from '@/lib/HitDist';

describe('HitDistribution', () => {
  describe('cumulative', () => {
    test('merges hits of the same damage', () => {
      const dist = new HitDistribution([
        new WeightedHit(0.25, [new Hitsplat(0, true)]),
        new WeightedHit(0.25, [new Hitsplat(1, true)]),
        new WeightedHit(0.25, [new Hitsplat(1, true)]),
        new WeightedHit(0.25, [new Hitsplat(2, true)]),
      ]);

      const cumulative = dist.cumulative();
      expect(cumulative.hits).toHaveLength(3);
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.25, [new Hitsplat(0, true)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.5, [new Hitsplat(1, true)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.25, [new Hitsplat(2, true)]));
    });

    test('preserves inaccurate zero hits', () => {
      const dist = new HitDistribution([
        new WeightedHit(0.5, [new Hitsplat(0, false)]),
        new WeightedHit(0.125, [new Hitsplat(0, true)]),
        new WeightedHit(0.125, [new Hitsplat(1, true)]),
        new WeightedHit(0.125, [new Hitsplat(1, true)]),
        new WeightedHit(0.125, [new Hitsplat(2, true)]),
      ]);

      const cumulative = dist.cumulative();
      expect(cumulative.hits).toHaveLength(4);
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.5, [new Hitsplat(0, false)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.125, [new Hitsplat(0, true)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.25, [new Hitsplat(1, true)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.125, [new Hitsplat(2, true)]));
    });

    test('preserves inaccurate non-zero hits', () => {
      const dist = new HitDistribution([
        new WeightedHit(0.5, [new Hitsplat(0, false)]),
        new WeightedHit(0.125, [new Hitsplat(5, false)]),
        new WeightedHit(0.125, [new Hitsplat(5, true)]),
        new WeightedHit(0.125, [new Hitsplat(1, false)]),
        new WeightedHit(0.125, [new Hitsplat(2, true)]),
      ]);

      const cumulative = dist.cumulative();
      expect(cumulative.hits).toHaveLength(5);
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.5, [new Hitsplat(0, false)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.125, [new Hitsplat(5, false)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.125, [new Hitsplat(5, true)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.125, [new Hitsplat(1, false)]));
      expect(cumulative.hits).toContainEqual(new WeightedHit(0.125, [new Hitsplat(2, true)]));
    });
  });
});
