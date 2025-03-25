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
