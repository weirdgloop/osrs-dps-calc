import BaseCalc, { CalcOpts, InternalOpts } from '@/lib/BaseCalc';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
// import { OVERHEAD_PRAYERS, Prayer } from '@/enums/Prayer';
import {
  AttackDistribution, HitDistribution, Hitsplat, WeightedHit,
} from '@/lib/HitDist';
import { ALWAYS_ACCURATE_MONSTERS, NPC_HARDCODED_MAX_HIT, SECONDS_PER_TICK } from '@/lib/constants';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { DetailKey } from '@/lib/CalcDetails';
import { PrayerMap } from '@/enums/Prayer';
import { sum } from 'd3-array';

/**
 * Class for computing various NPC-vs-player metrics.
 */
export default class NPCVsPlayerCalc extends BaseCalc {
  private memoizedDist?: AttackDistribution;

  private memoizedPlayerVsNPCCalc?: PlayerVsNPCCalc;

  constructor(player: Player, monster: Monster, opts: Partial<CalcOpts> = {}) {
    super(player, monster, opts);
  }

  public getDistribution(): AttackDistribution {
    if (this.memoizedDist === undefined) {
      this.memoizedDist = this.getDistributionImpl();
    }

    return this.memoizedDist;
  }

  public getPlayerVsNPCCalc(): PlayerVsNPCCalc {
    if (this.memoizedPlayerVsNPCCalc === undefined) {
      this.memoizedPlayerVsNPCCalc = new PlayerVsNPCCalc(this.player, this.monster, <InternalOpts>{
        loadoutName: `${this.opts.loadoutName}/forward`,
        disableMonsterScaling: true,
      });
    }

    return this.memoizedPlayerVsNPCCalc;
  }

  private getPlayerDefensiveBonus() {
    let styleBonus = 0;
    switch (this.monster.style) {
      case 'crush':
        styleBonus = this.player.defensive.crush;
        break;
      case 'stab':
        styleBonus = this.player.defensive.stab;
        break;
      case 'slash':
        styleBonus = this.player.defensive.slash;
        break;
      case 'magic':
        styleBonus = this.player.defensive.magic;
        break;
      case 'ranged':
        styleBonus = this.player.defensive.ranged;
        break;
      default:
        break;
    }
    return styleBonus;
  }

  public getDistributionImpl(): AttackDistribution {
    const acc = this.getHitChance();
    const max = this.getNPCMaxHit();
    const bonus = this.getPlayerDefensiveBonus();

    // Standard linear
    const standardHitDist = HitDistribution.linear(acc, 0, max);
    let dist = new AttackDistribution([standardHitDist]);

    if (this.wearing('Elysian spirit shield')) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.3).hits,
          ...standardHitDist.scaleProbability(0.7).hits.map((h) => new WeightedHit(h.probability, h.hitsplats.map((d) => {
            const reduction = Math.max(1, Math.trunc(d.damage / 4));
            return new Hitsplat(Math.max(0, d.damage - reduction), d.accurate);
          }))),
        ]),
      ]);
    }

    if (this.wearing(["Dinh's bulwark", "Dinh's blazing bulwark"]) && this.player.style.name === 'Block') {
      // Monster damage reduced by 20%
      dist = dist.scaleDamage(0.8);
    }

    if (this.isWearingJusticiarArmour()) {
      const reduction = 1 - bonus / 3000;
      dist = new AttackDistribution([
        new HitDistribution([
          ...dist.dists[0].hits.map((h) => new WeightedHit(h.probability, h.hitsplats.map((s) => new Hitsplat(Math.trunc(s.damage * reduction), s.accurate)))),
        ]),
      ]);
    }

    // There's some monsters that can hit through prayers, but let's worry about that later
    // const style = this.monster.style || '';
    // if (
    //   (['crush', 'stab', 'slash'].includes(style) && this.getOverheadPrayer() === Prayer.PROTECT_MELEE)
    //   || (style === 'magic' && this.getOverheadPrayer() === Prayer.PROTECT_MAGIC)
    //   || (style === 'ranged' && this.getOverheadPrayer() === Prayer.PROTECT_RANGED)
    // ) {
    //   return new AttackDistribution([new HitDistribution([new WeightedHit(1.0, [0])])]);
    // }

    return dist;
  }

  /**
   * Get the overhead prayer being used. Only one can be used at a time, so we can just return whichever matches first.
   */
  // private getOverheadPrayer(): Prayer | null {
  //   return this.player.prayers.find((p) => OVERHEAD_PRAYERS.includes(p)) || null;
  // }

  /**
   * Get the player's defence roll for this loadout
   */
  public getPlayerDefenceRoll(): number {
    const stance = this.player.style.stance;
    const style = this.monster.style || '';
    const skills = this.player.skills;
    const boosts = this.player.boosts;
    const prayers = this.player.prayers.map((p) => PrayerMap[p]);

    let stanceBonus = 0;
    if (stance === 'Defensive') stanceBonus += 3;
    if (stance === 'Controlled') stanceBonus += 1;
    if (stance === 'Longrange') stanceBonus += 3;

    const bonus = this.getPlayerDefensiveBonus();

    let effectiveLevel = this.trackAdd(DetailKey.PLAYER_DEFENCE_ROLL_LEVEL, skills.def, boosts.def);
    const numerator = sum(
      prayers.filter((pr) => pr.factorDefence),
      (p) => p.factorDefence![0] - 100,
    );
    effectiveLevel = this.trackFactor(DetailKey.PLAYER_DEFENCE_ROLL_LEVEL_PRAYER, effectiveLevel, [numerator + 100, 100]);

    if (this.isWearingTorags()) {
      const currentHealth = skills.hp + boosts.hp;
      const missingHealth = ((Math.round((skills.hp - currentHealth) / skills.hp * 100) / 100) * 100);
      effectiveLevel = this.trackFactor(DetailKey.PLAYER_DEFENCE_ROLL_LEVEL_TORAGS, effectiveLevel, [1 + missingHealth, 100]);
    }

    if (style === 'magic') {
      let effectiveMagicLevel = this.trackAdd(DetailKey.PLAYER_DEFENCE_ROLL_MAGIC_LEVEL, skills.magic, boosts.magic);
      for (const p of prayers.filter((pr) => pr.factorDefenceMagic && pr.combatStyle === 'magic')) {
        effectiveMagicLevel = this.trackFactor(DetailKey.PLAYER_DEFENCE_ROLL_MAGIC_LEVEL_PRAYER, effectiveMagicLevel, p.factorDefenceMagic!);
      }

      effectiveLevel = Math.trunc(effectiveMagicLevel * 7 / 10) + Math.trunc(effectiveLevel * 3 / 10);
    }

    effectiveLevel = this.trackAdd(DetailKey.PLAYER_DEFENCE_ROLL_EFFECTIVE_LEVEL, effectiveLevel, stanceBonus);
    const gearBonus = this.trackAdd(DetailKey.PLAYER_DEFENCE_ROLL_GEAR_BONUS, bonus, 64);

    return this.track(DetailKey.PLAYER_DEFENCE_ROLL_FINAL, (8 + effectiveLevel) * gearBonus);
  }

  /**
   * Get the NPC's attack roll, based on their combat style
   */
  public getNPCMaxAttackRoll(): number {
    const style = this.monster.style || '';
    const skills = this.monster.skills;
    const bonuses = this.monster.offensive;

    let roll = 0;
    let bonus = 0;

    if (['slash', 'crush', 'stab'].includes(style)) {
      roll = this.trackAdd(DetailKey.NPC_ACCURACY_ROLL_BASE, 9, skills.atk);
      bonus = this.trackAdd(DetailKey.NPC_ACCURACY_ROLL_BONUS, bonuses.atk, 64);
    }
    if (style === 'ranged') {
      roll = this.trackAdd(DetailKey.NPC_ACCURACY_ROLL_BASE, 9, skills.ranged);
      bonus = this.trackAdd(DetailKey.NPC_ACCURACY_ROLL_BONUS, bonuses.ranged, 64);
    }
    if (style === 'magic') {
      roll = this.trackAdd(DetailKey.NPC_ACCURACY_ROLL_BASE, 9, skills.magic);
      bonus = this.trackAdd(DetailKey.NPC_ACCURACY_ROLL_BONUS, bonuses.magic, 64);
    }

    return this.track(DetailKey.NPC_ACCURACY_ROLL_FINAL, roll * bonus);
  }

  /**
   * Get the NPC's max hit, based on their combat style
   */
  public getNPCMaxHit(): number {
    const style = this.monster.style || '';
    const skills = this.monster.skills;
    const bonuses = this.monster.offensive;
    const name = this.monster.name;

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

    // Some monsters have a hardcoded max hit. Let's overwrite the max hit with the real value here.
    if (Object.prototype.hasOwnProperty.call(NPC_HARDCODED_MAX_HIT, this.monster.id)) {
      maxHit = NPC_HARDCODED_MAX_HIT[this.monster.id];
    } else if (style === 'magic' && this.monster.maxHit !== undefined && maxHit !== this.monster.maxHit) {
      // For now, if the monster is using the magic attack style and the max hit on the wiki is different to the max hit
      // returned by the standard calculation we're using above, then let's just use the wiki value. A lot of magic
      // monsters have a hardcoded max hit (see https://twitter.com/JagexAsh/status/1754447323222929712).
      maxHit = this.monster.maxHit;
    }

    // Some monsters have a reduced max hit under specific conditions
    if (name === 'Aberrant spectre' && (this.wearing('Nose peg') || this.isWearingSlayerHelmet())) maxHit = 8;
    if (name === 'Dust devil' && (this.wearing('Face mask') || this.isWearingSlayerHelmet())) maxHit = 8;
    if (name === 'Banshee' && (this.wearing('Earmuffs') || this.isWearingSlayerHelmet())) maxHit = 2;
    if (name === 'Wall beast' && (this.wearing('Spiny helmet') || this.isWearingSlayerHelmet())) maxHit = 4;
    if (name === 'Sourhog' && (this.wearing('Reinforced goggles') || this.isWearingSlayerHelmet())) maxHit = 6;
    if (['Ice troll female', 'Thrower Troll', 'Thrower troll (Trollheim)'].includes(name) && this.wearing('Neitiznot shield')) maxHit = 2;

    return maxHit;
  }

  /**
   * Get the NPC's hit chance
   */
  public getHitChance(): number {
    if (ALWAYS_ACCURATE_MONSTERS.includes(this.monster.id)) {
      // This NPC will always hit the player with their attacks
      return 1;
    }

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

  /**
   * Returns the average damage taken for a kill.
   */
  public getAverageDamageTaken() {
    const ttk = this.getPlayerVsNPCCalc().getTtk();
    return ttk ? ttk * this.getDps() : undefined;
  }
}
