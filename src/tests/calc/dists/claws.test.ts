import { expect, describe, test } from '@jest/globals';
import { burningClawDoT, burningClawSpec } from '@/lib/dists/claws';

describe('burning claws expected damage over time', () => {
  test('100% accuracy', () => {
    // 15% chance per splat to deal 10 damage = 1.5 expected
    // * 3 hitsplats = 4.5
    expect(burningClawDoT(1.0)).toBe(4.5);
  });

  test('50% accuracy', () => {
    // first roll hits = 50% chance
    //    15% chance per hitsplat = 1.5 expected if hit
    //    50% chance of hit => 0.75 expected
    //    * 3 hitsplats = 2.25 expected
    // second roll hits = 50% no hit yet * 50% accuracy = 25%
    //    30% chance per hitsplat = 3 expected if hit
    //    25% chance of hit => 0.75 expected
    //    * 3 hitsplats = 2.25 expected
    // third roll hits = 25% no hit yet * 50% accuracy = 12.5%
    //    45% chance per hitsplat = 4.5 expected if hit
    //    12.5% chance of hit => 0.5625 expected
    //    * 3 hitsplats = 1.6875 expected
    // sum of all
    //    2.25 + 2.25 + 1.6875 = 6.1875
    expect(burningClawDoT(0.5)).toBe(6.1875);
  });

  test('25% accuracy', () => {
    // first roll hits = 25% chance
    //    15% chance per hitsplat = 1.5 expected if hit
    //    25% chance of hit => 0.375 expected
    //    * 3 hitsplats = 1.125 expected
    // second roll hits = 75% no hit yet * 25% accuracy = 18.75%
    //    30% chance per hitsplat = 3 expected if hit
    //    18.75% chance of hit => 0.5625 expected
    //    * 3 hitsplats = 1.6875 expected
    // third roll hits = 56.25% no hit yet * 25% accuracy = 14.0625%
    //    45% chance per hitsplat = 4.5 expected if hit
    //    14.0625% chance of hit => 0.6328125 expected
    //    * 3 hitsplats = 1.8984375 expected
    // sum of all
    //    1.125 + 1.6875 + 1.8984375 = 4.7109375
    expect(burningClawDoT(0.25)).toBe(4.7109375);
  });

  test('0% accuracy', () => {
    expect(burningClawDoT(0)).toBe(0);
  });
});

describe('burning claws spec dist', () => {
  describe('max melee max hit', () => {
    // as of 2024-07-10
    // https://github.com/user-attachments/assets/efbd7e48-461b-42d5-9509-ee7e139e7a11
    const expected = 36 + 18 + 18;
    const baseMax = 42;

    expect(burningClawSpec(1.0, baseMax).getMax()).toBe(expected);
  });
});
