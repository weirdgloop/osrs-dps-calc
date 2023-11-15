import {cross, max, sum} from "d3-array";
import {HistogramEntry} from "@/types/State";

export type HitTransformer = (hitsplat: number) => HitDistribution;

export function flatLimitTransformer(max: number): HitTransformer {
    return (h) => new HitDistribution(
        [new WeightedHit(1.0, [Math.min(h, max)])]
    );
}

export function linearMinTransformer(max: number): HitTransformer {
    return (h) => {
        const d = new HitDistribution([]);
        const prob = 1.0 / (max + 1);
        for (let i = 0; i <= max; i++) {
            d.addHit(new WeightedHit(
                prob,
                [Math.min(h, i)]
            ));
        }
        return d.flatten();
    }
}

export class WeightedHit {
    readonly probability: number;
    private readonly hitsplats: number[];

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
            new WeightedHit(this.probability, [...this.hitsplats.slice(1)])
        ];
    }

    public transform(t: HitTransformer): HitDistribution {
        if (this.hitsplats.length == 1) {
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

    public getHitsplats(): number[] {
        return [...this.hitsplats];
    }

    public getHash(): number {
        let acc = 0;
        for (let hitsplat of this.hitsplats) {
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
                .map(hits => hits[0].zip(hits[1]))
        );
    }

    public transform(t: HitTransformer): HitDistribution {
        const d = new HitDistribution([]);
        for (let h of this.hits) {
            for (let transformed of h.transform(t).hits) {
                d.addHit(transformed);
            }
        }
        return d;
    }

    public scaleProbability(factor: number): HitDistribution {
        return new HitDistribution(this.hits
            .map(h => h.scale(factor)));
    }

    public scaleDamage(factor: number, divisor: number = 1): HitDistribution {
        return new HitDistribution(this.hits
            .map(h => new WeightedHit(
                h.probability,
                h.getHitsplats().map(s => Math.trunc(s * factor / divisor))
            )));
    }

    public flatten(): HitDistribution {
        const acc = new Map<number, number>();
        const hitLists = new Map<number, number[]>();
        for (let hit of this.hits) {
            const hash = hit.getHash();
            const prev = acc.get(hash);
            if (prev === undefined) {
                acc.set(hash, hit.probability);
                hitLists.set(hash, hit.getHitsplats());
            } else {
                acc.set(hash, prev + hit.probability);
            }
        }

        const d = new HitDistribution([]);
        for (let [hash, prob] of acc.entries()) {
            d.addHit(new WeightedHit(prob, hitLists.get(hash) as number[]));
        }
        return d;
    }

    public cumulative(): HitDistribution {
        const d = new HitDistribution([]);
        const acc = new Map<number, number>();
        for (let hit of this.hits) {
            const key = hit.getSum();
            const prev = acc.get(key);
            if (prev === undefined) {
                acc.set(key, hit.probability);
            } else {
                acc.set(key, prev + hit.probability);
            }
        }

        for (let [dmg, prob] of acc.entries()) {
            d.addHit(new WeightedHit(prob, [dmg]));
        }

        return d;
    }

    public expectedHit(): number {
        return sum(this.hits
            .map(h => h.getExpectedValue()));
    }

    public size(): number {
        return this.hits.length;
    }

    public getMax(): number {
        return max(this.hits
            .map(h => h.getSum())) as number;
    }

    public static linear(accuracy: number, min: number, max: number): HitDistribution {
        const d = new HitDistribution([]);
        const hitProb = accuracy / (max - min + 1);
        for (let i = min; i <= max; i++) {
            d.addHit(new WeightedHit(hitProb, [i]));
        }
        d.addHit(new WeightedHit(1 - accuracy, [0]));
        return d;
    }

    public static single(accuracy: number, hit: number): HitDistribution {
        const d = new HitDistribution([
            new WeightedHit(accuracy, [hit])
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

    constructor(dists: HitDistribution[]) {
        this.dists = dists;
    }

    public addDist(d: HitDistribution): void {
        this.dists.push(d);
    }

    public expectedDamage(): number {
        return sum(this.dists
            .map(d => d.expectedHit()));
    }

    public transform(t: HitTransformer): AttackDistribution {
        return this.map(d => d.transform(t));
    }

    public flatten(): AttackDistribution {
        return this.map(d => d.flatten());
    }

    public scaleProbability(factor: number): AttackDistribution {
        return this.map(d => d.scaleProbability(factor));
    }

    public scaleDamage(factor: number, divisor: number = 1) {
        return this.map(d => d.scaleDamage(factor, divisor));
    }

    public asHistogram(): HistogramEntry[] {
        const dist = (this.dists.length === 1)
            ? this.dists[0]
            : this.dists.reduce((d1, d2) => d1.zip(d2));

        const hitMap = new Map<number, number>();
        dist.cumulative().hits.forEach(h => hitMap.set(h.getSum(), h.probability));

        const ret: HistogramEntry[] = [];
        for (let i = 0; i <= dist.getMax(); i++) {
            const prob = hitMap.get(i);
            if (prob === undefined) {
                ret.push({name: i, chance: 0});
            } else {
                ret.push({name: i, chance: prob});
            }
        }
        
        return ret;
    }

    public getMax(): number {
        return max(this.dists.map(d => d.getMax())) || 0;
    }

    public getExpectedDamage(): number {
        return max(this.dists.map(d => d.expectedHit())) || 0;
    }

    private map(m: (d: HitDistribution) => HitDistribution) {
        return new AttackDistribution(
            this.dists.map(m)
        );
    }

}