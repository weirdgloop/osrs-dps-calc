import {
  AttackDistribution, HitDistribution, Hitsplat, WeightedHit,
} from '@/lib/HitDist';
import { sum } from 'd3-array';

const generateTotals = (accRoll: number, totalRolls: number, acc: number, max: number, highOffset: number): [chance: number, low: number, high: number] => {
  const low = Math.trunc(max * (totalRolls - accRoll) / 4);
  const high = max + low + highOffset;
  const chancePreviousRollsFail = (1 - acc) ** accRoll;
  const chanceThisRollPasses = chancePreviousRollsFail * acc;
  const chancePerDmg = chanceThisRollPasses / (high - low + 1);

  return [chancePerDmg, low, high];
};

export const dClawDist = (acc: number, max: number): AttackDistribution => {
  const dist = new HitDistribution([]);
  for (let accRoll = 0; accRoll < 4; accRoll++) {
    const [chancePerDmg, low, high] = generateTotals(accRoll, 4, acc, max, -1);
    for (let dmg = low; dmg <= high; dmg++) {
      switch (accRoll) {
        case 0:
          dist.addHit(new WeightedHit(chancePerDmg, [
            new Hitsplat(Math.trunc(dmg / 2)),
            new Hitsplat(Math.trunc(dmg / 4)),
            new Hitsplat(Math.trunc(dmg / 8)),
            new Hitsplat(Math.trunc(dmg / 8) + 1),
          ]));
          break;

        case 1:
          dist.addHit(new WeightedHit(chancePerDmg, [
            new Hitsplat(Math.trunc(dmg / 2)),
            new Hitsplat(Math.trunc(dmg / 4)),
            new Hitsplat(Math.trunc(dmg / 4) + 1),
            Hitsplat.INACCURATE,
          ]));
          break;

        case 2:
          dist.addHit(new WeightedHit(chancePerDmg, [
            new Hitsplat(Math.trunc(dmg / 2)),
            new Hitsplat(Math.trunc(dmg / 2) + 1),
            Hitsplat.INACCURATE,
            Hitsplat.INACCURATE,
          ]));
          break;

        default:
          dist.addHit(new WeightedHit(chancePerDmg, [
            new Hitsplat(dmg + 1),
            Hitsplat.INACCURATE,
            Hitsplat.INACCURATE,
            Hitsplat.INACCURATE,
          ]));
          break;
      }
    }
  }

  const chanceAllFail = (1 - acc) ** 4;
  dist.addHit(new WeightedHit(chanceAllFail * 2 / 3, [
    new Hitsplat(1, false),
    new Hitsplat(1, false),
    Hitsplat.INACCURATE,
    Hitsplat.INACCURATE,
  ]));
  dist.addHit(new WeightedHit(chanceAllFail / 3, [
    Hitsplat.INACCURATE,
    Hitsplat.INACCURATE,
    Hitsplat.INACCURATE,
    Hitsplat.INACCURATE,
  ]));
  return new AttackDistribution([dist]);
};

export const burningClawSpec = (acc: number, max: number): AttackDistribution => {
  const dist = new HitDistribution([]);
  for (let accRoll = 0; accRoll < 3; accRoll++) {
    const [chancePerDmg, low, high] = generateTotals(accRoll, 3, acc, max, 0);
    for (let dmg = low; dmg <= high; dmg++) {
      switch (accRoll) {
        case 0:
          dist.addHit(new WeightedHit(chancePerDmg, [
            new Hitsplat(Math.trunc(dmg / 2)),
            new Hitsplat(Math.trunc(dmg / 4)),
            new Hitsplat(Math.trunc(dmg / 4)),
          ]));
          break;

        case 1:
          dist.addHit(new WeightedHit(chancePerDmg, [
            new Hitsplat(Math.trunc(dmg / 2) - 1),
            new Hitsplat(Math.trunc(dmg / 2) - 1),
            new Hitsplat(2),
          ]));
          break;

        default:
          dist.addHit(new WeightedHit(chancePerDmg, [
            new Hitsplat(dmg - 2),
            new Hitsplat(1),
            new Hitsplat(1),
          ]));
          break;
      }
    }
  }

  const chanceAllFail = (1 - acc) ** 3;
  dist.addHit(new WeightedHit(chanceAllFail / 5, [
    Hitsplat.INACCURATE,
    Hitsplat.INACCURATE,
    Hitsplat.INACCURATE,
  ]));
  dist.addHit(new WeightedHit(2 * chanceAllFail / 5, [
    new Hitsplat(1, false),
    Hitsplat.INACCURATE,
    Hitsplat.INACCURATE,
  ]));
  dist.addHit(new WeightedHit(2 * chanceAllFail / 5, [
    new Hitsplat(1, false),
    new Hitsplat(1, false),
    Hitsplat.INACCURATE,
  ]));
  return new AttackDistribution([dist]);
};

// truth table ; 1 = burn, 0 = no burn
export const BURN_MATRIX = [
  [0, 0, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 0, 0],
  [1, 0, 1],
  [1, 1, 0],
  [1, 1, 1],
];
export const BURN_EXPECTED = [0, 1, 2].map((accRoll) => sum(BURN_MATRIX, (row) => {
  const burnChance = 0.15 * (accRoll + 1);
  const burn1 = (row[0] === 1 ? burnChance : (1 - burnChance));
  const burn2 = (row[1] === 1 ? burnChance : (1 - burnChance));
  const burn3 = (row[2] === 1 ? burnChance : (1 - burnChance));
  const chanceOfRow = burn1 * burn2 * burn3;

  let damage = sum(row, (entry) => entry * 10);
  if (row[0] === 1 && row[1] === 1) {
    // there's a (presumed) bug here, where if the first two hitsplats apply burn,
    // then they overlap and miss 1 damage on the first tick.
    // https://discord.com/channels/177206626514632704/1098698914498101368/1285181996896620566
    damage -= 1;
  }

  return chanceOfRow * damage;
}));

export const burningClawDoT = (acc: number): number => {
  // 10 damage burn x3 hitsplats, 15/30/45% chance per splat dependent on which roll hits
  let accumulator = 0;

  for (let accRoll = 0; accRoll < 3; accRoll++) {
    const prevRollsFail = (1 - acc) ** accRoll;
    const thisRollHits = prevRollsFail * acc;

    accumulator += thisRollHits * BURN_EXPECTED[accRoll];
  }
  return accumulator;
};
