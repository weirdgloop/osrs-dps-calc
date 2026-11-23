import { Monster } from '@/types/Monster';
import applyCoxScaling from '@/lib/scaling/ChambersOfXeric';
import applyTobScaling from '@/lib/scaling/TheatreOfBlood';
import applyToaScaling from '@/lib/scaling/TombsOfAmascut';
import applyVardScaling from '@/lib/scaling/Vardorvis';
import applyDefenceReductions from '@/lib/scaling/DefenceReduction';
import applyMonsterPhases from '@/lib/scaling/Phases';
import { keys } from '@/utils';

type MonsterTransformer = (m: Monster) => Monster;
const ORDER_OF_OPERATIONS: MonsterTransformer[] = [
  applyCoxScaling,
  applyTobScaling,
  applyToaScaling,
  applyVardScaling,
  applyMonsterPhases,
  applyDefenceReductions,
];

export const scaleMonster = (m: Monster): Monster => {
  for (const transformer of ORDER_OF_OPERATIONS) {
    m = transformer(m);
  }
  return m;
};

export const applicableDefenceReductions = (m: Monster): Monster['inputs']['defenceReductions'] => {
  const reductions = m.inputs.defenceReductions;
  const none = Object.fromEntries(keys(reductions).map((k) => [k, typeof reductions[k] === 'boolean' ? false : 0])) as typeof reductions;
  const scaledWith = (r: typeof reductions) => {
    const scaled = scaleMonster({ ...m, inputs: { ...m.inputs, defenceReductions: r } });
    return JSON.stringify([scaled.skills, scaled.defensive]);
  };
  const baseline = scaledWith(none);
  const result = { ...none };
  keys(reductions).forEach((k) => {
    if (reductions[k] !== none[k] && scaledWith({ ...none, [k]: reductions[k] }) !== baseline) {
      Object.assign(result, { [k]: reductions[k] });
    }
  });
  return result;
};

// to save a lot of unneeded compute work if hp is the only thing that changes
export const scaleMonsterHpOnly = (m: Monster): Monster => {
  if (m.name === 'Vardorvis') {
    return applyVardScaling(m);
  }

  return m;
};
