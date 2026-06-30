export type Factor = [factor: number, divisor: number];
export type MinMax = [min: number, max: number];

export const lerp = (curr: number, srcStart: number, srcEnd: number, dstStart: number, dstEnd: number): number => {
  // todo replace usages with iLerp
  // does this need to be int-based?
  const srcRange = srcEnd - srcStart;
  const dstRange = dstEnd - dstStart;
  const currNorm = curr - srcStart;

  return Math.trunc(((currNorm * dstRange) / srcRange) + dstStart);
};

export const iSqrt = (x: number) => Math.trunc(Math.sqrt(x));
export const iLerp = (x1: number, x2: number, y1: number, y2: number, yc: number): number => x1 + Math.trunc((x2 - x1) * (yc - y1) / (y2 - y1));
export const addPercent = (x: number, pct: number): number => x + Math.trunc(x * pct / 100);

/**
 * Count of permutations of k selections from n items
 * @param n number of items to choose from
 * @param k number of selections
 */
export const choose = (k: number, n: number): number => {
  let acc = 1;
  for (let i = 1; i <= k; i++) {
    acc *= n - i + 1;
    acc /= i;
  }

  return acc;
};

/**
 * Chance of exactly k events happening in n trials
 * @param p probability of an event happening
 * @param n number of trials
 * @param k number of events
 */
export const binomal = (p: number, k: number, n: number): number => {
  const permutations = choose(k, n);
  const chanceAllHappen = p ** k;
  const chanceExtrasDontHappen = (1 - p) ** (n - k);
  return permutations * chanceAllHappen * chanceExtrasDontHappen;
};
