import { useEffect } from 'react';
import { reaction } from 'mobx';

const useReaction = (
  deps: Parameters<typeof reaction>[0],
  effect: Parameters<typeof reaction>[1],
  opts?: Parameters<typeof reaction>[2],
) => {
  const disposer = reaction(deps, effect, opts);
  return useEffect(() => () => disposer());
};

export default useReaction;
