export type Factor = [factor: number, divisor: number];
export type MinMax = [min: number, max: number];

export const lerp = (curr: number, srcStart: number, srcEnd: number, dstStart: number, dstEnd: number): number => {
  // does this need to be int-based?
  const srcRange = srcEnd - srcStart;
  const dstRange = dstEnd - dstStart;
  const currNorm = curr - srcStart;

  return Math.trunc(((currNorm * dstRange) / srcRange) + dstStart);
};
