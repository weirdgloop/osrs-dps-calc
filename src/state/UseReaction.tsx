import { useEffect } from 'react';
import { autorun, reaction } from 'mobx';

export const useReaction = (
  deps: Parameters<typeof reaction>[0],
  effect: Parameters<typeof reaction>[1],
  opts?: Parameters<typeof reaction>[2],
) => {
  const disposer = reaction(deps, effect, opts);
  return useEffect(() => () => disposer());
};

export const useAutorun = (
  view: Parameters<typeof autorun>[0],
  opts?: Parameters<typeof autorun>[1],
) => {
  const disposer = autorun(view, opts);
  return useEffect(() => () => disposer());
};
