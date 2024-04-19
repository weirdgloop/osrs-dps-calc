/* eslint max-classes-per-file: 0 */
/* eslint @typescript-eslint/no-use-before-define: 0 */
import {
  cross, max, some, sum,
} from 'd3-array';
import { ChartEntry } from '@/types/State';

export type HitTransformer = (hitsplat: Hitsplat) => HitDistribution;

export type TransformOpts = {
  transformInaccurate: boolean,
};

export const DEFAULT_TRANSFORM_OPTS: TransformOpts = {
  transformInaccurate: true,
};

export class Hitsplat {
  public static INACCURATE: Hitsplat = new Hitsplat(0, false);

  public constructor(
    public readonly damage: number,
    public readonly accurate: boolean = true,
  ) {}

  public transform(t: HitTransformer, opts: TransformOpts = DEFAULT_TRANSFORM_OPTS): HitDistribution {
    if (!this.accurate && !opts.transformInaccurate) {
      return new HitDistribution([new WeightedHit(1.0, [this])]);
    }
    return t(this);
  }
}

export class WeightedHit {
  public constructor(
    public readonly probability: number,
    public readonly hitsplats: Hitsplat[],
  ) {}

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
      new WeightedHit(1.0, this.hitsplats.slice(1)),
    ];
  }

  public transform(t: HitTransformer, opts: TransformOpts = DEFAULT_TRANSFORM_OPTS): HitDistribution {
    if (this.hitsplats.length === 1) {
      return this.hitsplats[0].transform(t, opts)
        .scaleProbability(this.probability);
    }

    // recursively zip first hitsplat with remaining hitsplats
    const [head, tail] = this.shift();
    return head.transform(t, opts)
      .zip(tail.transform(t, opts));
  }

  public anyAccurate(): boolean {
    return some(this.hitsplats, (h) => h.accurate);
  }

  public getSum(): number {
    return sum(this.hitsplats, (h) => h.damage);
  }

  public getExpectedValue(): number {
    return this.probability * this.getSum();
  }

  public getHash(): number {
    let acc = 0;
    for (const hitsplat of this.hitsplats) {
      acc <<= 8;
      acc |= hitsplat.damage;
      acc <<= 1;
      acc |= (hitsplat.accurate ? 1 : 0);
    }
    return acc;
  }
}

export class HitDistribution {
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

  public transform(t: HitTransformer, opts: TransformOpts = DEFAULT_TRANSFORM_OPTS): HitDistribution {
    const d = new HitDistribution([]);
    for (const h of this.hits) {
      for (const transformed of h.transform(t, opts).hits) {
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
        h.hitsplats.map((s) => new Hitsplat(Math.trunc(s.damage * factor / divisor), s.accurate)),
      )));
  }

  public flatten(): HitDistribution {
    const acc = new Map<number, number>();
    const hitLists = new Map<number, Hitsplat[]>();
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
      d.addHit(new WeightedHit(prob, hitLists.get(hash)!));
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
      // if 1 splat is accurate, treat the whole hit as accurate
      // if inaccurate, take the bitwise inverse so that we have a number key that's distinct, we'll undo it later
      const key = hit.anyAccurate() ? hit.getSum() : ~hit.getSum();
      const prev = acc.get(key);
      if (prev === undefined) {
        acc.set(key, hit.probability);
      } else {
        acc.set(key, prev + hit.probability);
      }
    }

    for (const [key, prob] of acc.entries()) {
      const accurate = key >= 0;
      const dmg = accurate ? key : ~key;
      d.addHit(new WeightedHit(prob, [new Hitsplat(dmg, accurate)]));
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
      d.addHit(new WeightedHit(hitProb, [new Hitsplat(i)]));
    }
    d.addHit(new WeightedHit(1 - accuracy, [Hitsplat.INACCURATE]));
    return d;
  }

  public static single(accuracy: number, hit: number): HitDistribution {
    const d = new HitDistribution([
      new WeightedHit(accuracy, [new Hitsplat(hit)]),
    ]);
    if (accuracy !== 1.0) {
      d.addHit(new WeightedHit(1 - accuracy, [Hitsplat.INACCURATE]));
    }
    return d;
  }
}

export class AttackDistribution {
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

  public transform(t: HitTransformer, opts: TransformOpts = DEFAULT_TRANSFORM_OPTS): AttackDistribution {
    return this.map((d) => d.transform(t, opts));
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

  public asHistogram(): (ChartEntry & { name: string, value: number })[] {
    const dist = this.singleHitsplat;

    const hitMap = new Map<number, number>();
    dist.hits.forEach((h) => hitMap.set(h.getSum(), (hitMap.get(h.getSum()) || 0) + h.probability));

    const ret: { name: string, value: number }[] = [];
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
    [new WeightedHit(1.0, [new Hitsplat(Math.min(h.damage, maximum), h.accurate)])],
  );
}

export function linearMinTransformer(maximum: number, offset: number = 0): HitTransformer {
  return (h) => {
    const d = new HitDistribution([]);
    const prob = 1.0 / (maximum + 1);
    for (let i = 0; i <= maximum; i++) {
      d.addHit(new WeightedHit(
        prob,
        [new Hitsplat(Math.min(h.damage, i + offset), h.accurate)],
      ));
    }
    return d.flatten();
  };
}

export function cappedRerollTransformer(limit: number, rollMax: number, offset: number = 0): HitTransformer {
  return (h) => {
    if (h.damage <= limit) {
      return new HitDistribution([new WeightedHit(1.0, [h])]);
    }

    const d = new HitDistribution([]);
    const prob = 1.0 / (rollMax + 1);
    for (let i = 0; i <= rollMax; i++) {
      d.addHit(new WeightedHit(
        prob,
        [new Hitsplat(h.damage > limit ? i + offset : h.damage, h.accurate)],
      ));
    }
    return d.flatten();
  };
}

export function multiplyTransformer(numerator: number, divisor: number, minimum: number = 0): HitTransformer {
  return (h) => {
    const dmg = Math.max(minimum, Math.trunc(numerator * h.damage / divisor));
    return new HitDistribution(
      [new WeightedHit(1.0, [new Hitsplat(dmg, h.accurate)])],
    );
  };
}

export function divisionTransformer(divisor: number, minimum: number = 0): HitTransformer {
  return multiplyTransformer(1, divisor, minimum);
}

export function flatAddTransformer(addend: number): HitTransformer {
  return (h) => new HitDistribution([
    new WeightedHit(1.0, [new Hitsplat(h.damage + addend, h.accurate)]),
  ]);
}
