const MAX_BURN_STACKS = 5;
const HITS_PER_STACK = 10;
const INACTIVE = -1;
const EMPTY_COUNTS: number[] = Array(HITS_PER_STACK).fill(0);
const BURN_INTERVAL = 4;
const CONVERGENCE_TOL = 1e-10;
const MAX_ITER = 20_000;

// Phase: number of ticks between the previous burn tick and the current attack tick
// Counts: x1, x2, ..., x10 where each xi is the number of burn stacks with i damage remaining
interface BurnState {
  phase: number;
  counts: number[];
}

// State space indices of the states reached when a burn doesn't or does proc at a given step
interface StateStep {
  noProcIndex: number;
  procIndex: number;
}

// Set of all possible burn states and their transition states
interface BurnStateSpace {
  states: BurnState[];
  steps: StateStep[];
}

const totalStacks = (counts: number[]): number => counts.reduce((a, b) => a + b, 0);

const addStack = (counts: number[]): number[] => {
  const next = counts.slice();
  next[HITS_PER_STACK - 1] += 1;
  return next;
};

const applyBurnTick = (counts: number[]): number[] => [...counts.slice(1), 0];

const inactiveState = (): BurnState => ({ phase: INACTIVE, counts: EMPTY_COUNTS });

// Encode the burn state as a base-6 integer to use as a Map key
// e.g., (phase = 1, counts = 0, 0, 0, 0, 0, 0, 0, 0, 0, 1) => 10000000001 in base 6 (60466177 in decimal)
// This works because phase is in [-1, 3] and counts are in [0, 5]
const stateToInt = (phase: number, counts: number[]): number => {
  let key = phase + 1;
  for (let i = 0; i < HITS_PER_STACK; i++) {
    key = key * 6 + counts[i];
  }
  return key;
};

// Number of burn ticks that happened since the previous attack
const burnsSinceLast = (phase: number, attackSpeed: number): number => {
  const nextBurnOffset = phase === 0 ? 0 : BURN_INTERVAL - phase;
  if (nextBurnOffset >= attackSpeed) {
    return 0;
  }
  return Math.floor((attackSpeed - 1 - nextBurnOffset) / BURN_INTERVAL) + 1;
};

const applyBurnsSinceLast = (counts: number[], phase: number, attackSpeed: number): BurnState => {
  let current = counts;
  const burnCount = burnsSinceLast(phase, attackSpeed);
  for (let t = 0; t < burnCount; t++) {
    current = applyBurnTick(current);
    if (totalStacks(current) === 0) {
      return inactiveState();
    }
  }
  return { phase: (phase + attackSpeed) % BURN_INTERVAL, counts: current };
};

const nextState = (state: BurnState, procOccurs: boolean, attackSpeed: number): BurnState => {
  if (state.phase === INACTIVE) {
    if (!procOccurs) {
      return inactiveState();
    }
    return applyBurnsSinceLast(addStack(EMPTY_COUNTS), 0, attackSpeed);
  }

  let counts = state.counts;
  if (procOccurs && totalStacks(counts) < MAX_BURN_STACKS) {
    counts = addStack(counts);
  }

  return applyBurnsSinceLast(counts, state.phase, attackSpeed);
};

const buildStateSpace = (attackSpeed: number): BurnStateSpace => {
  const states: BurnState[] = [];
  const steps: StateStep[] = [];
  const stateToIndex = new Map<number, number>();

  const getOrAddStateIndex = (state: BurnState): number => {
    const key = stateToInt(state.phase, state.counts);
    let index = stateToIndex.get(key);
    if (index === undefined) {
      // Add a new state space entry if this state hasn't been added yet
      index = states.length;
      stateToIndex.set(key, index);
      states.push(state);
      steps.push({ noProcIndex: 0, procIndex: 0 });
    }
    return index;
  };

  getOrAddStateIndex(inactiveState());

  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    const noProcState = nextState(state, false, attackSpeed);
    const procState = nextState(state, true, attackSpeed);

    steps[i] = { noProcIndex: getOrAddStateIndex(noProcState), procIndex: getOrAddStateIndex(procState) };
  }

  return { states, steps };
};

const steadyStateBurnDist = (stateSpace: BurnStateSpace, procChance: number, tol = CONVERGENCE_TOL, maxIter = MAX_ITER): Float64Array => {
  const { steps } = stateSpace;
  let dist = new Float64Array(steps.length);
  dist[0] = 1;

  for (let iter = 1; iter <= maxIter; iter++) {
    const next = new Float64Array(steps.length);
    for (let i = 0; i < steps.length; i++) {
      const prob = dist[i];
      if (prob === 0) {
        continue;
      }

      const { noProcIndex, procIndex } = steps[i];
      if (noProcIndex === procIndex) {
        // If both lead to the same state, the burn cap must have been hit, so it doesn't proc
        next[noProcIndex] += prob;
        continue;
      }

      next[noProcIndex] += prob * (1 - procChance);
      next[procIndex] += prob * procChance;
    }

    let diff = 0;
    for (let i = 0; i < next.length; i++) {
      next[i] = 0.5 * next[i] + 0.5 * dist[i];
      diff += Math.abs(next[i] - dist[i]);
    }

    dist = next;
    if (diff < tol) {
      return dist;
    }
  }
  return dist;
};

// eslint-disable-next-line import/prefer-default-export
export const getExpectedBurn = (hitChance: number, attackSpeed: number, burnChance: number, tol = CONVERGENCE_TOL, maxIter = MAX_ITER): number => {
  const procChance = hitChance * burnChance;
  const stateSpace = buildStateSpace(attackSpeed);
  const steadyStateDist = steadyStateBurnDist(stateSpace, procChance, tol, maxIter);

  let capProb = 0;
  for (let i = 0; i < stateSpace.states.length; i++) {
    if (totalStacks(stateSpace.states[i].counts) === MAX_BURN_STACKS) {
      capProb += steadyStateDist[i];
    }
  }

  return HITS_PER_STACK * procChance * (1 - capProb);
};
