import {
  HitDistribution, Hitsplat, HitTransformer, WeightedHit,
} from '@/lib/HitDist';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { some } from 'd3-array';
import { Monster } from '@/types/Monster';

export interface BoltContext {
  rangedLvl: number;
  maxHit: number;
  zcb: boolean;
  spec: boolean;
  kandarinDiary: boolean;
  monster: Monster;
}
export type BoltTransformer = (ctx: BoltContext) => HitTransformer;

const kandarinFactor = ({ kandarinDiary }: BoltContext): number => (kandarinDiary ? 1.1 : 1.0);

const bonusDamageTransform = ({ zcb, spec }: BoltContext, chance: number, bonusDmg: number, accurateOnly: boolean): HitTransformer => (h) => {
  if (h.accurate && zcb && spec) {
    return HitDistribution.single(1.0, [new Hitsplat(h.damage + bonusDmg)]);
  }
  if (!h.accurate && accurateOnly) {
    return new HitDistribution([new WeightedHit(1.0, [h])]);
  }
  return new HitDistribution([
    new WeightedHit(chance, [new Hitsplat(h.damage + bonusDmg, h.accurate)]),
    new WeightedHit(1 - chance, [new Hitsplat(h.damage, h.accurate)]),
  ]);
};

export const opalBolts: BoltTransformer = (ctx) => {
  const { rangedLvl, zcb } = ctx;
  const chance = 0.05 * kandarinFactor(ctx);
  const bonusDmg = Math.trunc(rangedLvl / (zcb ? 9 : 10));

  return bonusDamageTransform(ctx, chance, bonusDmg, false);
};

export const pearlBolts: BoltTransformer = (ctx) => {
  const { rangedLvl, zcb, monster } = ctx;
  const chance = 0.06 * kandarinFactor(ctx);
  const divisor = monster.attributes.includes(MonsterAttribute.FIERY) ? 15 : 20;
  const bonusDmg = Math.trunc(rangedLvl / (zcb ? divisor - 2 : divisor));

  return bonusDamageTransform(ctx, chance, bonusDmg, false);
};

export const diamondBolts: BoltTransformer = (ctx) => {
  const { maxHit, zcb, spec } = ctx;
  const chance = 0.1 * kandarinFactor(ctx);
  const effectMax = Math.trunc(maxHit * (zcb ? 126 : 115) / 100);

  const effectDist = HitDistribution.linear(1.0, 0, effectMax);
  return (h) => {
    if (h.accurate && zcb && spec) {
      return effectDist;
    }
    return new HitDistribution([
      ...effectDist.scaleProbability(chance).hits,
      new WeightedHit(1 - chance, [new Hitsplat(h.damage, h.accurate)]),
    ]);
  };
};

export const dragonstoneBolts: BoltTransformer = (ctx) => {
  const { rangedLvl, zcb, monster } = ctx;

  if (some(monster.attributes, (attr) => attr === MonsterAttribute.FIERY || attr === MonsterAttribute.DRAGON)) {
    // immune to dragonfire
    return (h) => new HitDistribution([new WeightedHit(1.0, [h])]);
  }

  const chance = 0.06 * kandarinFactor(ctx);
  const bonusDmg = Math.trunc(rangedLvl * 2 / (zcb ? 9 : 10));

  return bonusDamageTransform(ctx, chance, bonusDmg, true);
};

export const onyxBolts: BoltTransformer = (ctx) => {
  const {
    maxHit, zcb, spec, monster,
  } = ctx;

  if (monster.attributes.includes(MonsterAttribute.UNDEAD)) {
    // immune to life leech
    return (h) => new HitDistribution([new WeightedHit(1.0, [h])]);
  }

  const chance = 0.11 * kandarinFactor(ctx);
  const effectMax = Math.trunc(maxHit * (zcb ? 132 : 120) / 100);

  const effectDist = HitDistribution.linear(1.0, 0, effectMax);
  return (h) => {
    if (!h.accurate) {
      return new HitDistribution([new WeightedHit(1.0, [h])]);
    }
    if (zcb && spec) {
      return effectDist;
    }
    return new HitDistribution([
      ...effectDist.scaleProbability(chance).hits,
      new WeightedHit(1 - chance, [new Hitsplat(h.damage, h.accurate)]),
    ]);
  };
};

export const rubyBolts: BoltTransformer = (ctx) => {
  const { zcb, spec, monster } = ctx;

  const chance = 0.06 * kandarinFactor(ctx);
  const cap = zcb ? 110 : 100;
  const effectDmg = Math.trunc(monster.inputs.monsterCurrentHp * (zcb ? 22 : 20) / 100);
  const effectHit = HitDistribution.single(1.0, [new Hitsplat(Math.min(cap, effectDmg))]);

  return (h) => {
    if (h.accurate && zcb && spec) {
      return effectHit;
    }
    return new HitDistribution([
      ...effectHit.scaleProbability(chance).hits,
      new WeightedHit(1 - chance, [new Hitsplat(h.damage, h.accurate)]),
    ]);
  };
};
