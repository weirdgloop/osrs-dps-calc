import { cross, max, sum } from 'd3-array';
import { ChartEntry } from '@/types/State';

export type HitTransformer = (hitsplat: number) => HitDistribution;

export class WeightedHit {
  readonly probability: number;

  readonly hitsplats: number[];

  public constructor(probability: number, hitsplats: number[]) {
    this.probability = probability;
    this.hitsplats = hitsplats;
  }

  public scale(factor: number): WeightedHit {
    return new WeightedHit(
      this.probability * factor,
      [...this.hitsplats],
    );
  }

  public zip(other: WeightedHit): WeightedHit {
    return new WeightedHit(
      this.probability * other.probability,
      [...this.hitsplats, ...other.hitsplats],
    );
  }

  public shift(): [WeightedHit, WeightedHit] {
    return [
      new WeightedHit(this.probability, [this.hitsplats[0]]),
      new WeightedHit(this.probability, [...this.hitsplats.slice(1)]),
    ];
  }

  public transform(t: HitTransformer): HitDistribution {
    if (this.hitsplats.length === 1) {
      return t(this.hitsplats[0])
        .scaleProbability(this.probability);
    }

    // recursively zip first hitsplat with remaining hitsplats
    const [head, tail] = this.shift();
    return head.transform(t)
      .zip(tail.transform(t));
  }

  public getSum(): number {
    return sum(this.hitsplats);
  }

  public getExpectedValue(): number {
    return this.probability * this.getSum();
  }

  public getHash(): number {
    let acc = 0;
    for (const hitsplat of this.hitsplats) {
      acc <<= 8;
      acc |= hitsplat;
    }
    return acc;
  }
}

export class HitDistribution {
  public static readonly EMPTY: HitDistribution = new HitDistribution(
    [new WeightedHit(1.0, [0])],
  );

  readonly hits: WeightedHit[];

  constructor(hits: WeightedHit[]) {
    this.hits = hits;
  }

  public addHit(w: WeightedHit): void {
    this.hits.push(w);
  }

  public zip(other: HitDistribution): HitDistribution {
    return new HitDistribution(
      cross(this.hits, other.hits)
        .map((hits) => hits[0].zip(hits[1])),
    );
  }

  public transform(t: HitTransformer): HitDistribution {
    const d = new HitDistribution([]);
    for (const h of this.hits) {
      for (const transformed of h.transform(t).hits) {
        d.addHit(transformed);
      }
    }
    return d.flatten();
  }

  public scaleProbability(factor: number): HitDistribution {
    return new HitDistribution(this.hits
      .map((h) => h.scale(factor)));
  }

  public scaleDamage(factor: number, divisor: number = 1): HitDistribution {
    return new HitDistribution(this.hits
      .map((h) => new WeightedHit(
        h.probability,
        h.hitsplats.map((s) => Math.trunc(s * factor / divisor)),
      )));
  }

  public flatten(): HitDistribution {
    const acc = new Map<number, number>();
    const hitLists = new Map<number, number[]>();
    for (const hit of this.hits) {
      const hash = hit.getHash();
      const prev = acc.get(hash);
      if (prev === undefined) {
        acc.set(hash, hit.probability);
        hitLists.set(hash, hit.hitsplats);
      } else {
        acc.set(hash, prev + hit.probability);
      }
    }

    const d = new HitDistribution([]);
    for (const [hash, prob] of acc.entries()) {
      d.addHit(new WeightedHit(prob, hitLists.get(hash) as number[]));
    }
    return d;
  }

  /**
     * Converts multi-hits into a single cumulative damage total.
     */
  public cumulative(): HitDistribution {
    const d = new HitDistribution([]);
    const acc = new Map<number, number>();
    for (const hit of this.hits) {
      const key = hit.getSum();
      const prev = acc.get(key);
      if (prev === undefined) {
        acc.set(key, hit.probability);
      } else {
        acc.set(key, prev + hit.probability);
      }
    }

    for (const [dmg, prob] of acc.entries()) {
      d.addHit(new WeightedHit(prob, [dmg]));
    }

    return d;
  }

  public expectedHit(): number {
    return sum(this.hits
      .map((h) => h.getExpectedValue()));
  }

  public size(): number {
    return this.hits.length;
  }

  public getMax(): number {
    return max(this.hits
      .map((h) => h.getSum())) as number;
  }

  public static linear(accuracy: number, min: number, maximum: number): HitDistribution {
    const d = new HitDistribution([]);
    const hitProb = accuracy / (maximum - min + 1);
    for (let i = min; i <= maximum; i++) {
      d.addHit(new WeightedHit(hitProb, [i]));
    }
    d.addHit(new WeightedHit(1 - accuracy, [0]));
    return d;
  }

  public static single(accuracy: number, hit: number): HitDistribution {
    const d = new HitDistribution([
      new WeightedHit(accuracy, [hit]),
    ]);
    if (accuracy !== 1.0) {
      d.addHit(new WeightedHit(1 - accuracy, [0]));
    }
    return d;
  }
}

export class AttackDistribution {
  public static readonly EMPTY: AttackDistribution = new AttackDistribution(
    [HitDistribution.EMPTY],
  );

  readonly dists: HitDistribution[];

  private _singleHitsplat: HitDistribution | undefined = undefined;

  get singleHitsplat(): HitDistribution {
    if (!this._singleHitsplat) {
      this._singleHitsplat = this.dists.reduce((prev, curr) => prev.zip(curr)).cumulative();
    }
    return this._singleHitsplat;
  }

  constructor(dists: HitDistribution[]) {
    this.dists = dists;
  }

  public addDist(d: HitDistribution): void {
    this.dists.push(d);
  }

  public transform(t: HitTransformer): AttackDistribution {
    return this.map((d) => d.transform(t));
  }

  public flatten(): AttackDistribution {
    return this.map((d) => d.flatten());
  }

  public scaleProbability(factor: number): AttackDistribution {
    return this.map((d) => d.scaleProbability(factor));
  }

  public scaleDamage(factor: number, divisor: number = 1) {
    return this.map((d) => d.scaleDamage(factor, divisor));
  }

  public getMax(): number {
    return sum(this.dists.map((d) => d.getMax())) || 0;
  }

  public getExpectedDamage(): number {
    return sum(this.dists.map((d) => d.expectedHit())) || 0;
  }

  public asHistogram(): ChartEntry[] {
    const dist = this.singleHitsplat;

    const hitMap = new Map<number, number>();
    dist.hits.forEach((h) => hitMap.set(h.getSum(), h.probability));

    const ret: ChartEntry[] = [];
    for (let i = 0; i <= dist.getMax(); i++) {
      const prob = hitMap.get(i);
      if (prob === undefined) {
        ret.push({ name: i.toString(), value: 0 });
      } else {
        ret.push({ name: i.toString(), value: prob });
      }
    }

    return ret;
  }

  private map(m: (d: HitDistribution) => HitDistribution) {
    return new AttackDistribution(
      this.dists.map(m),
    );
  }
}

export function flatLimitTransformer(maximum: number): HitTransformer {
  return (h) => new HitDistribution(
    [new WeightedHit(1.0, [Math.min(h, maximum)])],
  );
}

export function linearMinTransformer(maximum: number, offset: number = 0): HitTransformer {
  return (h) => {
    const d = new HitDistribution([]);
    const prob = 1.0 / (maximum + 1);
    for (let i = 0; i <= maximum; i++) {
      d.addHit(new WeightedHit(
        prob,
        [Math.min(h, i + offset)],
      ));
    }
    return d.flatten();
  };
}

export function cappedRerollTransformer(limit: number, rollMax: number, offset: number = 0): HitTransformer {
  return (h) => {
    const d = new HitDistribution([]);
    const prob = 1.0 / (rollMax + 1);
    for (let i = 0; i <= rollMax; i++) {
      d.addHit(new WeightedHit(
        prob,
        [h > limit ? i + offset : h],
      ));
    }
    return d.flatten();
  };
}

export function multiplyTransformer(numerator: number, divisor: number, minimum: number = 0): HitTransformer {
  return (h) => new HitDistribution(
    h === 0
      ? [new WeightedHit(1.0, [0])]
      : [new WeightedHit(1.0, [Math.max(minimum, Math.trunc(numerator * h / divisor))])],
  );
}

export function divisionTransformer(divisor: number, minimum: number = 0): HitTransformer {
  return multiplyTransformer(1, divisor, minimum);
}

export function flatAddTransformer(addend: number): HitTransformer {
  return (h) => new HitDistribution([
    new WeightedHit(1.0, [h + addend]),
  ]);
}
