import { max } from 'd3-array';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { SECONDS_PER_TICK } from '@/lib/constants';
import type { Monster } from '@/types/Monster';
import type { Player } from '@/types/Player';
import type { ChartEntry } from '@/types/Charts';
import type { WorkerCalcOpts } from '@/worker/CalcWorkerTypes';
import { scaleMonster, scaleMonsterHpOnly } from '@/lib/MonsterScaling';

export interface WeaponSwapPoint {
  hitpoints: number;
  loadoutIndex: number;
  loadoutName: string;
  expectedTicks: number;
  expectedSeconds: number;
  weaponOnlyExpectedTicks: number;
  weaponOnlyExpectedSeconds: number;
}

export interface WeaponSwapRange {
  fromHp: number;
  toHp: number;
  loadoutIndex: number;
  loadoutName: string;
}

export interface WeaponSwapMode {
  points: WeaponSwapPoint[];
  ranges: WeaponSwapRange[];
  chart: ChartEntry[];
}

export interface WeaponSwapResult {
  currentHp: number;
  cappedHp: number;
  truncated: boolean;
  continuous: WeaponSwapMode;
  discontinuous: WeaponSwapMode;
}

interface SwapLoadout {
  name: string;
  calc: PlayerVsNPCCalc;
  speed: number;
  baseHistogram: Map<number, number>;
}

const MAX_OPTIMIZED_HP = 400;

const histogramFromCalc = (calc: PlayerVsNPCCalc): Map<number, number> => {
  const histogram = new Map<number, number>();
  calc.getDistribution().singleHitsplat.hits.forEach((hit) => {
    const damage = hit.getSum();
    histogram.set(damage, (histogram.get(damage) || 0) + hit.probability);
  });
  return histogram;
};

const getHistogramAtHp = (
  loadout: Player,
  monster: Monster,
  hp: number,
): Map<number, number> => {
  const calcMonster = scaleMonsterHpOnly({
    ...monster,
    inputs: {
      ...monster.inputs,
      monsterCurrentHp: hp,
    },
  });
  const calc = new PlayerVsNPCCalc(loadout, calcMonster, {
    detailedOutput: false,
    disableMonsterScaling: true,
  });
  return histogramFromCalc(calc);
};

const buildRanges = (points: WeaponSwapPoint[]): WeaponSwapRange[] => {
  const ranges: WeaponSwapRange[] = [];
  for (const point of points) {
    const prev = ranges[ranges.length - 1];
    if (prev && prev.loadoutIndex === point.loadoutIndex && prev.toHp + 1 === point.hitpoints) {
      prev.toHp = point.hitpoints;
    } else {
      ranges.push({
        fromHp: point.hitpoints,
        toHp: point.hitpoints,
        loadoutIndex: point.loadoutIndex,
        loadoutName: point.loadoutName,
      });
    }
  }
  return ranges;
};

const getRemainingTicks = (
  remainingHp: number,
  continuous: boolean,
  speed: number,
  memory: Float64Array,
): number => {
  if (remainingHp > 0) {
    return memory[remainingHp];
  }
  if (continuous) {
    return 0;
  }
  return -speed;
};

const optimize = (
  loadouts: Player[],
  monster: Monster,
  swapLoadouts: SwapLoadout[],
  cappedHp: number,
  continuous: boolean,
): WeaponSwapMode => {
  const memory = new Float64Array(cappedHp + 1);
  const loadoutOnlyMemories = swapLoadouts.map(() => new Float64Array(cappedHp + 1));
  const points: WeaponSwapPoint[] = [];
  const chart: ChartEntry[] = [{ name: '0', hitpoints: 0 }];

  for (let hp = 1; hp <= cappedHp; hp++) {
    let bestTicks = Infinity;
    let bestWeaponOnlyTicks = Infinity;
    let bestIx = 0;

    for (const [ix, swapLoadout] of swapLoadouts.entries()) {
      const hist = swapLoadout.calc.distIsCurrentHpDependent(loadouts[ix], monster)
        ? getHistogramAtHp(loadouts[ix], monster, hp)
        : swapLoadout.baseHistogram;
      const missChance = hist.get(0) || 0;

      if (missChance >= 1) {
        continue;
      }

      let weightedRemainingTicks = 0;
      let weightedWeaponOnlyRemainingTicks = 0;
      for (const [damage, probability] of hist.entries()) {
        if (damage <= 0 || probability === 0) {
          continue;
        }

        const remainingHp = hp - damage;
        const remainingTicks = getRemainingTicks(remainingHp, continuous, swapLoadout.speed, memory);
        const weaponOnlyRemainingTicks = getRemainingTicks(
          remainingHp,
          continuous,
          swapLoadout.speed,
          loadoutOnlyMemories[ix],
        );
        weightedRemainingTicks += probability * remainingTicks;
        weightedWeaponOnlyRemainingTicks += probability * weaponOnlyRemainingTicks;
      }

      const expectedTicks = (weightedRemainingTicks + swapLoadout.speed) / (1 - missChance);
      const weaponOnlyExpectedTicks = (weightedWeaponOnlyRemainingTicks + swapLoadout.speed) / (1 - missChance);
      loadoutOnlyMemories[ix][hp] = weaponOnlyExpectedTicks;

      if (expectedTicks < bestTicks) {
        bestTicks = expectedTicks;
        bestWeaponOnlyTicks = weaponOnlyExpectedTicks;
        bestIx = ix;
      }
    }

    memory[hp] = bestTicks;
    const point: WeaponSwapPoint = {
      hitpoints: hp,
      loadoutIndex: bestIx,
      loadoutName: swapLoadouts[bestIx].name,
      expectedTicks: bestTicks,
      expectedSeconds: bestTicks * SECONDS_PER_TICK,
      weaponOnlyExpectedTicks: bestWeaponOnlyTicks,
      weaponOnlyExpectedSeconds: bestWeaponOnlyTicks * SECONDS_PER_TICK,
    };
    points.push(point);
    chart.push({
      name: hp.toString(),
      hitpoints: hp,
      [point.loadoutName]: parseFloat(point.expectedSeconds.toFixed(2)),
    });
  }

  return {
    points,
    ranges: buildRanges(points),
    chart,
  };
};

export const computeWeaponSwap = (
  loadouts: Player[],
  monster: Monster,
  calcOpts: WorkerCalcOpts,
): WeaponSwapResult | undefined => {
  if (loadouts.length < 2) {
    return undefined;
  }

  const scaledMonster = calcOpts.disableMonsterScaling
    ? monster
    : scaleMonster(JSON.parse(JSON.stringify(monster)) as Monster);

  const swapLoadouts = loadouts.map((loadout, i): SwapLoadout => {
    const calc = new PlayerVsNPCCalc(loadout, scaledMonster, {
      loadoutName: (i + 1).toString(),
      detailedOutput: false,
      disableMonsterScaling: true,
    });

    return {
      name: loadout.name || `Loadout ${i + 1}`,
      calc,
      speed: calc.getExpectedAttackSpeed(),
      baseHistogram: histogramFromCalc(calc),
    };
  });

  if (!swapLoadouts.some((loadout) => max(loadout.baseHistogram.keys()) || 0)) {
    return undefined;
  }

  const currentHp = scaledMonster.skills.hp;
  const cappedHp = Math.min(currentHp, MAX_OPTIMIZED_HP);

  return {
    currentHp,
    cappedHp,
    truncated: currentHp > cappedHp,
    continuous: optimize(loadouts, scaledMonster, swapLoadouts, cappedHp, true),
    discontinuous: optimize(loadouts, scaledMonster, swapLoadouts, cappedHp, false),
  };
};
