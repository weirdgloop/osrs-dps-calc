import { describe, test, expect } from '@jest/globals';
import { Hitsplat, multiplyTransformer } from '@/lib/HitDist';

describe('multiplyTransformer', () => {
  test('applies truncation', () => {
    expect(multiplyTransformer(5, 4)(new Hitsplat(5)).hits[0].hitsplats[0].damage).toBe(6);
  });
  test('does not reduce values below the minimum', () => {
    expect(multiplyTransformer(1, 5, 2)(new Hitsplat(3)).hits[0].hitsplats[0].damage).toBe(2);
  });
  test('does not raise values from below the minimum to above the minimum', () => {
    expect(multiplyTransformer(1, 5, 2)(new Hitsplat(1)).hits[0].hitsplats[0].damage).toBe(1);
  });
});
