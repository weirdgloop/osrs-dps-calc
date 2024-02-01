import BaseCalc, { CalcOpts } from '@/lib/BaseCalc';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { OVERHEAD_PRAYERS, Prayer } from '@/enums/Prayer';
import {AttackDistribution, HitDistribution, WeightedHit} from '@/lib/HitDist';
import {
  SECONDS_PER_TICK,
} from '@/lib/constants';

/**
 * Class for computing various NPC-vs-player metrics.
 */
export default class NPCVsPlayerCalc extends BaseCalc {
  private memoizedDist?: AttackDistribution;

  constructor(player: Player, monster: Monster, opts: Partial<CalcOpts> = {}) {
    super(player, monster, opts);
  }

  public getDistribution(): AttackDistribution {
    if (this.memoizedDist === undefined) {
      this.memoizedDist = this.getDistributionImpl();
    }

    return this.memoizedDist;
  }

  public getDistributionImpl(): AttackDistribution {
    const acc = this.getHitChance();
    const max = this.getNPCMaxHit();

    // Standard linear
    const standardHitDist = HitDistribution.linear(acc, 0, max);
    const dist = new AttackDistribution([standardHitDist]);

    // There's some monsters that can hit through prayers, but let's worry about that later
    const style = this.monster.style || '';
    if (
      (['crush', 'stab', 'slash'].includes(style) && this.getOverheadPrayer() === Prayer.PROTECT_MELEE)
      || (style === 'magic' && this.getOverheadPrayer() === Prayer.PROTECT_MAGIC)
      || (style === 'ranged' && this.getOverheadPrayer() === Prayer.PROTECT_RANGED)
    ) {
      return new AttackDistribution([new HitDistribution([new WeightedHit(1.0, [0])])]);
    }

    return dist;
  }

  /**
   * Get the overhead prayer being used. Only one can be used at a time, so we can just return whichever matches first.
   */
  private getOverheadPrayer(): Prayer | null {
    return this.player.prayers.find((p) => OVERHEAD_PRAYERS.includes(p)) || null;
  }

  /**
   * Get the player's defence roll for this loadout
   */
  public getPlayerDefenceRoll(): number {
    const stance = this.player.style.stance;
    const style = this.monster.style || '';
    const skills = this.player.skills;
    const defBonuses = this.player.defensive;

    let stanceBonus = 0;
    if (stance === 'Defensive') stanceBonus += 3;
    if (stance === 'Controlled') stanceBonus += 1;

    let bonus = 0;
    if (style === 'slash') bonus = defBonuses.slash;
    if (style === 'crush') bonus = defBonuses.crush;
    if (style === 'stab') bonus = defBonuses.stab;
    if (style === 'ranged') bonus = defBonuses.ranged;

    let skillBonus = skills.def;
    // TODO is this wrong?
    if (style === 'magic') {
      bonus = defBonuses.magic;
      skillBonus = ((70 / 100) * skills.magic) + ((30 / 100) * skills.def);
    }

    return (8 + skillBonus + stanceBonus) * (bonus + 64);
  }

  /**
   * Get the NPC's attack roll, based on their combat style
   */
  public getNPCMaxAttackRoll(): number {
    const style = this.monster.style || '';
    const skills = this.monster.skills;
    const bonus = this.monster.offensive;

    let roll = 0;
    if (['slash', 'crush', 'stab'].includes(style)) {
      roll = (9 + skills.atk) * (bonus.atk + 64);
    }
    if (style === 'ranged') {
      roll = (9 + skills.ranged) * (bonus.ranged + 64);
    }
    if (style === 'magic') {
      roll = (9 + skills.magic) * (bonus.magic + 64);
    }

    return roll;
  }

  /**
   * Get the NPC's max hit, based on their combat style
   */
  public getNPCMaxHit(): number {
    const style = this.monster.style || '';
    const skills = this.monster.skills;
    const bonuses = this.monster.offensive;

    let maxHit = 0;
    if (['slash', 'crush', 'stab'].includes(style)) {
      maxHit = Math.trunc(((9 + skills.str) * (bonuses.str + 64) + 320) / 640);
    }
    if (style === 'ranged') {
      maxHit = Math.trunc(((9 + skills.ranged) * (bonuses.ranged_str + 64) + 320) / 640);
    }
    if (style === 'magic') {
      maxHit = Math.trunc(((9 + skills.magic) * (bonuses.magic_str + 64) + 320) / 640);
    }

    return maxHit;
  }

  /**
   * Get the NPC's hit chance
   */
  public getHitChance(): number {
    const atk = this.getNPCMaxAttackRoll();
    const def = this.getPlayerDefenceRoll();

    return BaseCalc.getNormalAccuracyRoll(atk, def);
  }

  /**
   * Returns the expected damage per tick, based on the NPC's attack speed.
   */
  public getDpt() {
    return this.getDistribution().getExpectedDamage() / this.monster.speed;
  }

  /**
   * Returns the damage-per-second calculation, which is the damage-per-tick divided by the number of seconds per tick.
   */
  public getDps() {
    return this.getDpt() / SECONDS_PER_TICK;
  }
}
