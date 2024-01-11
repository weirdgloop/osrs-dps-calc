import {EquipmentPiece, Player} from '@/types/Player';
import {Monster} from '@/types/Monster';
import {
  AttackDistribution,
  flatLimitTransformer,
  HitDistribution,
  linearMinTransformer,
  WeightedHit
} from "@/lib/HitDist";
import {isBindSpell, isFireSpell, isWaterSpell} from "@/types/Spell";
import {PrayerMap} from "@/enums/Prayer";
import {sum} from "d3-array";
import {isVampyre, MonsterAttribute} from "@/enums/MonsterAttribute";
import {TOMBS_OF_AMASCUT_MONSTER_IDS, VERZIK_P1_IDS} from "@/constants";

const DEFAULT_ATTACK_SPEED = 4;
const SECONDS_PER_TICK = 0.6;

const TTK_DIST_MAX_ITER_ROUNDS = 1000;
const TTK_DIST_EPSILON = 0.0001;

export interface CalcOpts {
  overrides?: {
    accuracy?: number,
  }
}

const DEFAULT_OPTS: CalcOpts = {};

export default class CombatCalc {
  private player: Player;
  private monster: Monster;
  private opts: CalcOpts;

  // Array of the names of all equipped items (for quick checks)
  private allEquippedItems: string[];

  private memoizedDist: AttackDistribution | undefined = undefined;

  constructor(player: Player, monster: Monster, opts: Partial<CalcOpts> = {}) {
    this.player = player;
    this.monster = monster;
    this.opts = {
      ...DEFAULT_OPTS,
      ...opts,
    }

    this.allEquippedItems = Object.values(player.equipment).filter((v) => v !== null).flat(1).map((eq: EquipmentPiece | null) => eq?.name || '');
  }

  /**
   * Simple utility function for checking if an item name is equipped. If an array of string is passed instead, this
   * function will return a boolean indicating whether ANY of the provided items are equipped.
   * @param item - item name
   */
  private wearing(item: string): boolean;
  private wearing(items: string[]): boolean;
  private wearing(item: unknown): unknown {
    if (Array.isArray(item)) {
      return (item as string[]).some((i) => this.allEquippedItems.includes(i));
    } else if (typeof item === 'string') {
      return this.allEquippedItems.includes(item);
    }
  }

  /**
   * Simple utility function for checking if ALL passed items are equipped.
   * @param items - array of item names
   */
  private wearingAll(items: string[]) {
    return items.every((i) => this.allEquippedItems.includes(i));
  }

  /**
   * Whether the player is using either a slash, crush, or stab combat style.
   */
  private isUsingMeleeStyle(): boolean {
    return ['slash', 'crush', 'stab'].includes(this.player.style.type);
  }

  /**
   * Whether the player is wearing the full melee void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingMeleeVoid(): boolean {
    return this.wearingAll(['Void melee helm', 'Void knight top', 'Void knight robe', 'Void knight gloves']);
  }

  /**
   * Whether the player is wearing the full elite ranged void set.
   * @see https://oldschool.runescape.wiki/w/Elite_Void_Knight_equipment
   */
  private isWearingEliteRangedVoid(): boolean {
    return this.wearingAll(['Void ranger helm', 'Elite void top', 'Elite void robe', 'Void knight gloves']);
  }

  /**
   * Whether the player is wearing the full elite magic void set.
   * @see https://oldschool.runescape.wiki/w/Elite_Void_Knight_equipment
   */
  private isWearingEliteMagicVoid(): boolean {
    return this.wearingAll(['Void mage helm', 'Elite void top', 'Elite void robe', 'Void knight gloves']);
  }

  /**
   * Whether the player is wearing the full ranged void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingRangedVoid(): boolean {
    return this.wearingAll(['Void ranger helm', 'Void knight top', 'Void knight robe', 'Void knight gloves']);
  }

  /**
   * Whether the player is wearing the full magic void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingMagicVoid(): boolean {
    return this.wearingAll(['Void mage helm', 'Void knight top', 'Void knight robe', 'Void knight gloves']);
  }

  /**
   * Whether the player is wearing any item that acts as a black mask for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Black_mask
   */
  private isWearingBlackMask(): boolean {
    return this.isWearingImbuedBlackMask() || this.wearing(['Black mask', 'Slayer helmet']);
  }

  /**
   * Whether the player is wearing any item that acts as an imbued black mask for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Black_mask_(i)
   */
  private isWearingImbuedBlackMask(): boolean {
    return this.wearing(['Black mask (i)', 'Slayer helmet (i)']);
  }

  /**
   * Whether the player is using a smoke battlestaff or mystic smoke staff.
   * @see https://oldschool.runescape.wiki/w/Smoke_battlestaff
   */
  private isWearingSmokeStaff(): boolean {
    return this.wearing(['Smoke battlestaff', 'Mystic smoke staff']);
  }

  /**
   * Whether the player is using a Tzhaar weapon.
   * @see https://oldschool.runescape.wiki/w/Obsidian_equipment
   */
  private isWearingTzhaarWeapon(): boolean {
    return this.wearing(["Tzhaar-ket-em", "Tzhaar-ket-om", "Tzhaar-ket-om (t)", "Toktz-xil-ak", "Toktz-xil-ek"]);
  }

  /**
   * Whether the player is wearing the entire set of obsidian armour.
   * @see https://oldschool.runescape.wiki/w/Obsidian_equipment
   */
  private isWearingObsidian(): boolean {
    return this.wearingAll(['Obsidian helmet', 'Obsidian platelegs', 'Obsidian platebody']);
  }

  /**
   * Whether the player is using an item that acts as a crystal bow for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Crystal_bow
   */
  private isWearingCrystalBow(): boolean {
    return this.wearing('Crystal bow') || this.allEquippedItems.some((ei) => ei.includes('Bow of faerdhinen'));
  }

  /**
   * Whether the player is using any variant of Osmumten's fang.
   * @see https://oldschool.runescape.wiki/w/Osmumten%27s_fang
   */
  private isWearingFang(): boolean {
    return this.wearing(["Osmumten's fang", "Osmumten's fang (or)"]);
  }

  /**
   * Whether the player is using any variant of the scythe of vitur.
   * @see https://oldschool.runescape.wiki/w/Scythe_of_vitur
   */
  private isWearingScythe(): boolean {
    return this.wearing('Scythe of vitur') || this.allEquippedItems.some((ei) => ei.includes('of vitur'));
  }

  /**
   * Whether the player is using the Keris dagger.
   * @see https://oldschool.runescape.wiki/w/Keris
   */
  private isWearingKeris(): boolean {
    return this.allEquippedItems.some((ei) => ei.includes('Keris'));
  }

  /**
   * Whether the player is wearing the entire Dharok the Wretched's equipment set.
   * @see https://oldschool.runescape.wiki/w/Dharok_the_Wretched%27s_equipment
   */
  private isWearingDharok(): boolean {
    return this.wearingAll(["Dharok's helm", "Dharok's platebody", "Dharok's platelegs", "Dharok's greataxe"])
  }

  /**
   * Whether the player is wearing the entire Verac the Defiled's equipment set.
   * @see https://oldschool.runescape.wiki/w/Verac_the_Defiled%27s_equipment
   */
  private isWearingVeracs(): boolean {
    return this.wearingAll(["Verac's helm", "Verac's brassard", "Verac's plateskirt", "Verac's flail"])
  }

  /**
   * Whether the player is wearing the entire Karil the Tainted's equipment set.
   * @see https://oldschool.runescape.wiki/w/Karil_the_Tainted%27s_equipment
   */
  private isWearingKarils(): boolean {
    return this.wearingAll(["Karil's coif", "Karil's leathertop", "Karil's leatherskirt", "Karil's crossbow", "Amulet of the damned"])
  }

  /**
   * Whether the player is wearing the entire Ahrim the Blighted's equipment set.
   * @see https://oldschool.runescape.wiki/w/Ahrim_the_Blighted%27s_equipment
   */

  private isWearingAhrims(): boolean {
    return this.wearingAll(["Ahrim's staff", "Ahrim's hood", "Ahrim's robetop", "Ahrim's robeskirt", "Amulet of the damned"])
  }

  /**
   * Whether the player is wearing a silver weapon.
   * @see https://oldschool.runescape.wiki/w/Silver_weaponry
   */

  private isWearingSilverWeapon(): boolean {
    return this.wearing([
      'Blessed axe', 
      'Ivandis flail', 
      'Blisterwood flail', 
      'Silver sickle', 
      'Silver sickle (b)', 
      'Emerald sickle',
      'Emerald sickle (b)',
      'Enchanted emerald sickle (b)',
      'Ruby sickle (b)',
      'Enchanted ruby sickle (b)',
      'Blisterwood sickle',
      'Silverlight',
      'Darklight',
      'Arclight',
      'Rod of ivandis',
      'Wolfbane',
    ])
  }

  /**
   * Whether the player is using a combat spell from the Mage Arena.
   * @see https://oldschool.runescape.wiki/w/God_spells
   */
  private isUsingGodSpell(): boolean {
    return ['Saradomin Strike', 'Claws of Guthix', 'Flames of Zamorak'].includes(this.player.spell.name);
  }

  /**
   * Get the NPC defence roll for this loadout, which is based on the player's current combat style
   */
  public getNPCDefenceRoll(): number {
    let effectiveLevel = this.player.style.type === "magic"
        ? this.monster.skills.magic
        : this.monster.skills.def;

    effectiveLevel += 9;
    let defenceRoll = effectiveLevel * (this.monster.defensive[this.player.style.type] + 64);

    if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id || 0) && this.monster.toaInvocationLevel) {
      defenceRoll = Math.trunc(defenceRoll * (250 + this.monster.toaInvocationLevel) / 250);
    }

    return defenceRoll;
  }

  private getPlayerMaxMeleeAttackRoll(): number {
    const style = this.player.style;

    const boostedLevel = this.player.skills.atk + this.player.boosts.atk;
    const prayerBonus = this.getPrayerBonus(true);
    let effectiveLevel = Math.trunc(boostedLevel * prayerBonus);

    if (style.stance === 'Accurate') {
      effectiveLevel += 3;
    } else if (style.stance === 'Controlled') {
      effectiveLevel += 1;
    }

    effectiveLevel += 8;

    const isWearingVoid = this.isWearingMeleeVoid();
    if (isWearingVoid) {
      effectiveLevel = Math.trunc(effectiveLevel * 11/10);
    }

    let attackRoll = effectiveLevel * (this.player.offensive[style.type] + 64);

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const buffs = this.player.buffs;

    // These bonuses do not stack with each other
    if (this.wearing(['Salve amulet (e), Salve amulet(ei)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 7/6);
    } else if (this.isWearingBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 7/6);
    }

    if (this.wearing(["Viggora's chainmace", 'Ursine chainmace']) && buffs.inWilderness) {
      attackRoll = Math.trunc(attackRoll * 3/2);
    }
    if (this.wearing('Arclight') && mattrs.includes(MonsterAttribute.DEMON)) {
      attackRoll = Math.trunc(attackRoll * 17/10);
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes(MonsterAttribute.DRAGON)) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    }
    if (this.wearing('Keris partisan of breaching') && mattrs.includes(MonsterAttribute.KALPHITE)) {
      attackRoll = Math.trunc(attackRoll * 133/100); // https://twitter.com/JagexAsh/status/1704107285381787952
    }
    if (this.wearing(['Blisterwood flail', 'Blisterwood sickle']) && isVampyre(mattrs)) {
      attackRoll = Math.trunc(attackRoll * 21/20);
    }
    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      attackRoll = Math.trunc(attackRoll * 11/10);
    }

    // Inquisitor's armour set gives bonuses when using the crush attack style
    if (style.type === 'crush') {
      let inqPieces = this.allEquippedItems.filter((v) => [
        "Inquisitor's great helm",
        "Inquisitor's hauberk",
        "Inquisitor's plateskirt"
      ].includes(v)).length

      // When wearing the full set, the bonus is enhanced
      if (inqPieces === 3) inqPieces = 5;

      attackRoll = Math.trunc(attackRoll * (200 + inqPieces) / 200)
    }

    return attackRoll;
  }

  /**
   * Get the player's max melee hit
   */
  private getPlayerMaxMeleeHit(): number {
    const style = this.player.style;

    const boostedLevel = this.player.skills.str + this.player.boosts.str;
    const prayerBonus = this.getPrayerBonus(false);
    let effectiveLevel = Math.trunc(boostedLevel * prayerBonus);

    if (style.stance === 'Aggressive') {
      effectiveLevel += 3;
    } else if (style.stance === 'Controlled') {
      effectiveLevel += 1;
    }

    effectiveLevel += 8;

    const isWearingVoid = this.isWearingMeleeVoid();
    if (isWearingVoid) {
      effectiveLevel = Math.trunc(effectiveLevel * 11/10);
    }

    let maxHit = Math.trunc((effectiveLevel * (this.player.bonuses.str + 64) + 320) / 640); // should this be (.str) or (.melee_str)?
    const baseDmg = maxHit;

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const buffs = this.player.buffs;

    // These bonuses do not stack with each other
    if (this.wearing(['Salve amulet (e)', 'Salve amulet(ei)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 6/5);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 7/6);
    } else if (this.isWearingBlackMask() && buffs.onSlayerTask) {
      maxHit = Math.trunc(maxHit * 7/6);
    }

    if (this.wearing('Arclight') && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = Math.trunc(maxHit * 17/10);
    }
    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      maxHit = Math.trunc(baseDmg * 11/10); // TODO: confirm that this is the appropriate place
    }
    if (this.isWearingTzhaarWeapon() && this.wearing('Berserker necklace')) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes(MonsterAttribute.DRAGON)) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if (this.isWearingKeris() && mattrs.includes(MonsterAttribute.KALPHITE)) {
      maxHit = Math.trunc(maxHit * 133/100);
    }
    if (this.wearing('Barronite mace') && mattrs.includes(MonsterAttribute.GOLEM)) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if (this.wearing(["Viggora's chainmace", 'Ursine chainmace']) && buffs.inWilderness) {
      maxHit = Math.trunc(maxHit * 3/2);
    }
    if (this.wearing(['Silverlight', 'Darklight', 'Silverlight (dyed)']) && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = Math.trunc(maxHit * 8/5);
    }
    if (this.wearing('Blisterwood flail') && isVampyre(mattrs)) {
      maxHit = Math.trunc(maxHit * 5/4);
    }
    if (this.wearing('Blisterwood sickle') && isVampyre(mattrs)) {
      maxHit = Math.trunc(maxHit * 23/20);
    }
    if (this.wearing('Ivandis flail') && isVampyre(mattrs)) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if ((this.wearing("Efaritay's aid") || this.isWearingSilverWeapon()) && mattrs.includes(MonsterAttribute.VAMPYRE_1)) {
      maxHit = Math.trunc(maxHit * 11/10); // todo should this be before/after the vampyrebane weapons above?
    }
    if (this.wearing('Leaf-bladed battleaxe') && mattrs.includes(MonsterAttribute.LEAFY)) {
      maxHit = Math.trunc(maxHit * 47/40);
    }
    if (this.wearing('Colossal blade')) {
      maxHit = maxHit + Math.min(this.monster.size * 2, 10);
    }

    // Inquisitor's armour set gives bonuses when using the crush attack style
    if (style.type === 'crush') {
      let inqPieces = this.allEquippedItems.filter((v) => [
        "Inquisitor's great helm",
        "Inquisitor's hauberk",
        "Inquisitor's plateskirt"
      ].includes(v)).length

      // When wearing the full set, the bonus is enhanced
      if (inqPieces === 3) inqPieces = 5;

      maxHit = Math.trunc(maxHit * (200 + inqPieces) / 200);
    }

    // TODO: many more...
    return maxHit;
  }

  private getPlayerMaxRangedAttackRoll() {
    const style = this.player.style;

    const boostedLevel = this.player.skills.ranged + this.player.boosts.ranged;
    const prayerBonus = this.getPrayerBonus(true);
    let effectiveLevel = Math.trunc(boostedLevel * prayerBonus);

    if (style.stance === 'Accurate') {
      effectiveLevel += 3;
    }

    effectiveLevel += 8;

    if (this.isWearingRangedVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 11/10);
    }

    let attackRoll = effectiveLevel * (this.player.offensive.ranged + 64);

    if (this.isWearingCrystalBow()) {
      let crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      attackRoll = Math.trunc(attackRoll * (20 + crystalPieces) / 20);
    }

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const buffs = this.player.buffs;

    if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 7/6);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 23/20);
    }

    if (this.wearing('Twisted bow')) {
      let cap = 250;
      if (mattrs.includes(MonsterAttribute.XERICIAN)) cap = 350;

      let tbowMagic = Math.max(this.monster.skills.magic, this.monster.offensive.magic);
      let m = Math.trunc(Math.min(tbowMagic, cap) * 3/10);
      let tbowMod = Math.trunc(Math.min(140, (140 + (m*10-10)/100 - Math.pow(m-100, 2)/100)));
      attackRoll = Math.trunc(attackRoll * tbowMod / 100);
    }
    if (this.wearing(["Craw's bow", "Webweaver bow"]) && buffs.inWilderness) {
      attackRoll = Math.trunc(attackRoll * 3/2);
    }
    if (this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON)) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      attackRoll = Math.trunc(attackRoll * 13/10);
    }

    return attackRoll;
  }

  /**
   * Get the player's max ranged hit
   */
  private getPlayerMaxRangedHit() {
    const style = this.player.style;

    const boostedLevel = this.player.skills.ranged + this.player.boosts.ranged;
    const prayerBonus = this.getPrayerBonus(false);
    let effectiveLevel = Math.trunc(boostedLevel * prayerBonus);

    if (style.stance === 'Accurate') {
      effectiveLevel += 3;
    }

    effectiveLevel += 8;

    if (this.isWearingEliteRangedVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 9/8);
    } else if (this.isWearingRangedVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 11/10);
    }

    let maxHit = Math.trunc((effectiveLevel * (this.player.bonuses.ranged_str + 64) + 320) / 640);
    
    // tested this in-game, slayer helmet (i) + crystal legs + crystal body + bowfa, on accurate, no rigour, 99 ranged
    // max hit is 36, but would be 37 if placed after slayer helm
    if (this.isWearingCrystalBow()) {
      let crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      maxHit = Math.trunc(maxHit * (40 + crystalPieces) / 40);
    }

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const buffs = this.player.buffs;
    if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 6/5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 7/6);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      maxHit = Math.trunc(maxHit * 23/20);
    }

    if (this.wearing('Twisted bow')) {
      let cap = 250;
      if (mattrs.includes(MonsterAttribute.XERICIAN)) cap = 350;

      let tbowMagic = Math.max(this.monster.skills.magic, this.monster.offensive.magic);
      let m = Math.trunc(Math.min(tbowMagic, cap) * 3/10);
      let tbowMod = Math.trunc(Math.min(250, 250 + (m*10-14)/100 - Math.pow(m-140, 2)/100));
      maxHit = Math.trunc(maxHit * tbowMod / 100);
    }
    if (this.wearing(["Craw's bow", "Webweaver bow"]) && buffs.inWilderness) {
      maxHit = Math.trunc(maxHit * 3/2);
    }
    if (this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON)) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      maxHit = Math.trunc(maxHit * 5/4);
    }

    return maxHit;
  }

  private getPlayerMaxMagicAttackRoll() {
    const style = this.player.style;

    const boostedLevel = this.player.skills.magic + this.player.boosts.magic;
    const prayerBonus = this.getPrayerBonus(true);
    let effectiveLevel = Math.trunc(boostedLevel * prayerBonus);

    if (style.stance === 'Accurate') {
      effectiveLevel += 2;
    }

    effectiveLevel += 9;

    if (this.isWearingMagicVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 29/20);
    }

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const buffs = this.player.buffs;
    let magicBonus = this.player.offensive.magic;

    if (this.wearing("Tumeken's shadow")) {
      magicBonus = magicBonus * (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id || 0) ? 4 : 3);
    }

    let attackRoll = effectiveLevel * (magicBonus + 64);

    if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 23/20);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 23/20);
    }

    if (this.player.spell.name.includes('Demonbane') && mattrs.includes(MonsterAttribute.DEMON)) {
      if (this.player.buffs.markOfDarknessSpell) {
        attackRoll = Math.trunc(attackRoll * 28 / 20);
      } else {
        // still retains a 20% accuracy buff without mark
        attackRoll = Math.trunc(attackRoll * 24 / 20);
      }
    }
    if (this.wearing(["Thammaron's sceptre", "Accursed sceptre"]) && buffs.inWilderness) {
      attackRoll = Math.trunc(attackRoll * 3/2);
    }
    if (this.isWearingSmokeStaff() && this.player.spell.spellbook === 'standard') {
      attackRoll = Math.trunc(attackRoll * 11/10);
    }
    if (this.wearing('Tome of water') && (isWaterSpell(this.player.spell) || isBindSpell(this.player.spell))) { // todo does this go here?
      attackRoll = Math.trunc(attackRoll * 6/5);
    }

    return attackRoll;
  }

  /**
   * Get the player's max magic hit
   */
  private getPlayerMaxMagicHit() {
    let maxHit = 0;
    let magicLevel = this.player.skills.magic + this.player.boosts.magic;
    const spell = this.player.spell;

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const buffs = this.player.buffs;

    if (spell.max_hit) {
      maxHit = spell.max_hit;
    } else if (spell.name === 'Magic Dart') {
      if (this.wearing("Slayer's staff (e)") && buffs.onSlayerTask) {
        maxHit = Math.trunc(13 + magicLevel / 6);
      } else {
        maxHit = Math.trunc(10 + magicLevel / 10);
      }
    } else if (this.wearing('Starter staff')) {
      maxHit = 8;
    } else if (this.wearing(['Trident of the seas', 'Trident of the seas (e)'])) {
      maxHit = Math.trunc(magicLevel / 3 - 5);
    } else if (this.wearing("Thammaron's sceptre")) {
      maxHit = Math.trunc(magicLevel / 3 - 8);
    } else if (this.wearing('Accursed sceptre')) {
      maxHit = Math.trunc(magicLevel / 3 - 6);
    } else if (this.wearing(['Trident of the swamp', 'Trident of the swamp (e)'])) {
      maxHit = Math.trunc(magicLevel / 3 - 2);
    } else if (this.wearing(['Sanguinesti staff', 'Holy sanguinesti staff'])) {
      maxHit = Math.trunc(magicLevel / 3 - 1);
    } else if (this.wearing('Dawnbringer')) {
      maxHit = Math.trunc(magicLevel / 6 - 1);
    } else if (this.wearing("Tumeken's shadow")) {
      maxHit = Math.trunc(magicLevel / 3 + 1);
    } else if (this.wearing('Warped sceptre')) {
      maxHit = Math.trunc((8 * magicLevel + 96) / 37);
    } else if (this.wearing(['Crystal staff (basic)', 'Corrupted staff (basic)'])) {
      maxHit = 23;
    } else if (this.wearing(['Crystal staff (attuned)', 'Corrupted staff (attuned)'])) {
      maxHit = 31;
    } else if (this.wearing(['Crystal staff (perfected)', 'Corrupted staff (perfected)'])) {
      maxHit = 39;
    } else if (this.wearing('Swamp lizard')) {
      maxHit = Math.trunc((magicLevel * (56) + 320) / 640);
    } else if (this.wearing('Orange salamander')) {
      maxHit = Math.trunc((magicLevel * (59 + 64) + 320) / 640);
    } else if (this.wearing('Red salamander')) {
      maxHit = Math.trunc((magicLevel * (77 + 64) + 320) / 640);
    } else if (this.wearing('Black salamander')) {
      maxHit = Math.trunc((magicLevel * (92 + 64) + 320) / 640);
    }

    if (this.wearing('Chaos gauntlets') && spell.name.toLowerCase().includes('bolt')) {
      maxHit = maxHit + 3;
    }
    if (buffs.chargeSpell && this.isUsingGodSpell()) {
      maxHit = maxHit + 10;
    }

    let magicDmgBonus = this.player.bonuses.magic_str * 10; // is magic_str correct here?
    if (this.wearing("Tumeken's shadow")) {
      magicDmgBonus = magicDmgBonus * (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id || 0) ? 4 : 3);
    }

    if (this.isWearingEliteMagicVoid()) {
      magicDmgBonus = magicDmgBonus + 25;
    }
    if (this.isWearingSmokeStaff() && spell.spellbook === 'standard') {
      magicDmgBonus = magicDmgBonus + 100;
    }

    let blackMaskBonus = false;
    if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      magicDmgBonus = magicDmgBonus + 200;
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      magicDmgBonus = magicDmgBonus + 150;
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      blackMaskBonus = true;
    }

    maxHit = Math.trunc(maxHit * (1000 + magicDmgBonus) / 1000);

    if (blackMaskBonus) maxHit = Math.trunc(maxHit * 23/20);

    if (this.player.buffs.markOfDarknessSpell && this.player.spell.name.includes('Demonbane') && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = Math.trunc(maxHit * 25/20);
    }

    return maxHit;
  }

  private getPrayerBonus(accuracy: boolean): number {
    let prayers = this.player.prayers.map(p => PrayerMap[p]);
    if (this.isUsingMeleeStyle()) {
      prayers = prayers.filter(p => p.combatStyle === "melee");
    } else if (this.player.style.type === 'ranged') {
      prayers = prayers.filter(p => p.combatStyle === "ranged");
    } else if (this.player.style.type === 'magic') {
      prayers = prayers.filter(p => p.combatStyle === "magic");
    }

    return 1 + sum(prayers.map(p => accuracy ? p.factorAccuracy : p.factorStrength));
  }

  /**
   * Get the max hit for this loadout, which is based on the player's current combat style
   */
  private getMaxHit() {
    const style = this.player.style.type;
    if (this.isUsingMeleeStyle()) {
      return this.getPlayerMaxMeleeHit();
    } else if (style === 'ranged') {
      return this.getPlayerMaxRangedHit();
    } else if (style === 'magic') {
      return this.getPlayerMaxMagicHit();
    }

    return 0;
  }

  /**
   * Get the max attack roll for this loadout, which is based on the player's current combat style
   */
  public getMaxAttackRoll() {
    const style = this.player.style.type;
    if (this.isUsingMeleeStyle()) {
      return this.getPlayerMaxMeleeAttackRoll();
    } else if (style === 'ranged') {
      return this.getPlayerMaxRangedAttackRoll();
    } else if (style === 'magic') {
      return this.getPlayerMaxMagicAttackRoll();
    }

    return 0;
  }

  public getHitChance() {
    if (this.opts.overrides?.accuracy) {
      return this.opts.overrides.accuracy;
    }

    if (VERZIK_P1_IDS.includes(this.monster.id || 0) && this.wearing('Dawnbringer')) {
      return 1.0;
    }

    const atk = this.getMaxAttackRoll();
    const def = this.getNPCDefenceRoll();

    const hitChance = (atk > def)
        ? 1 - ((def + 2) / (2 * (atk + 1)))
        : atk / (2 * (def + 1));

      if (this.isWearingFang()) {
          if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id || 0)) {
            return 1 - Math.pow(1 - hitChance, 2);
          } else {
            return (atk > def)
              ? 1 - (def + 2) * (2 * def + 3) / (atk + 1) / (atk + 1) / 6
              : atk * (4 * atk + 5) / 6 / (atk + 1) / (def + 1);
          }
      }

    return hitChance;
  }

  public getDistribution(): AttackDistribution {
    if (this.memoizedDist !== undefined) {
      return this.memoizedDist;
    }

    return this.memoizedDist = this.getDistributionImpl();
  }

  private getDistributionImpl(): AttackDistribution {
    const mattrs = this.monster.attributes;
    const acc = this.getHitChance();
    const max = this.getMaxHit();

    // standard linear
    const standardHitDist = HitDistribution.linear(acc, 0, max);
    let dist = new AttackDistribution([standardHitDist]);

    if (this.isWearingFang()) {
      const shrink = Math.trunc(max * 3 / 20);
      dist = new AttackDistribution(
          [HitDistribution.linear(acc, shrink, max - shrink)],
      )
    }
    
    if (this.wearing('Gadderhammer') && mattrs.includes(MonsterAttribute.SHADE)) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.95).scaleDamage(5, 4).hits,
          ...standardHitDist.scaleProbability(0.05).scaleDamage(2).hits
        ]),
      ]);
    }

    if (this.isWearingDharok()) {
      const max = this.player.skills.hp;
      const curr = this.player.skills.hp + this.player.boosts.hp;
      dist = dist.scaleDamage(10000 + (max - curr) * max, 10000);
    }

    if (this.isWearingVeracs()) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.75).hits,
          ...HitDistribution.linear(1.0, 1, max + 1).scaleProbability(0.25).hits,
        ]),
      ]);
    }

    if (this.isWearingKarils()) {
      dist = new AttackDistribution([
        standardHitDist.scaleProbability(0.75),
        new HitDistribution([
          ...standardHitDist.hits.map(h => new WeightedHit(
            h.probability * 0.25, // 25% chance to
            [...h.getHitsplats(), ...h.getHitsplats().map(s => Math.trunc(s / 2))] // deal a second hitsplat of half damage
          )),
        ]),
      ]);
    }

    if (this.isWearingScythe()) {
      const hits: HitDistribution[] = [];
      for (let i = 0; i < Math.min(Math.max(this.monster.size, 1), 3); i++) {
        hits.push(HitDistribution.linear(acc, 0, Math.floor(max / (Math.pow(2, i)))));
      }
      dist = new AttackDistribution(hits);
    }

    if (this.isWearingKeris() && mattrs.includes(MonsterAttribute.KALPHITE)) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(50.0 / 51.0).hits,
          ...standardHitDist.scaleProbability(1.0 / 51.0).scaleDamage(3).hits,
        ])
      ])
    }

    if (this.wearing('Tome of fire') && isFireSpell(this.player.spell)) {
      dist = dist.scaleDamage(3, 2);
    }

    if (this.wearing('Tome of water') && isWaterSpell(this.player.spell)) {
      dist = dist.scaleDamage(6, 5);
    }

    if (this.isWearingAhrims()) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.75).hits,
          ...standardHitDist.scaleProbability(0.25).scaleDamage(13, 10).hits,
        ]),
      ]);
    }

    return this.applyLimiters(dist);
  }

  applyLimiters(dist: AttackDistribution): AttackDistribution {
    if (this.monster.name === 'Zulrah') {
      dist = dist.transform(flatLimitTransformer(50));
    }
    if (this.monster.name === 'Fragment of Seren') {
      // todo should this be if (hit > 24) { hit = randominc(2) + 22 }
      dist = dist.transform(linearMinTransformer(2, 22));
    }
    if (VERZIK_P1_IDS.includes(this.monster.id || 0) && !this.wearing('Dawnbringer')) {
      const limit = this.isUsingMeleeStyle() ? 10 : 3;
      dist = dist.transform(linearMinTransformer(limit));
    }
    if (this.monster.attributes.includes(MonsterAttribute.VAMPYRE_2) && this.wearing("Efaritay's aid") && !this.isWearingSilverWeapon()) {
      dist = dist.transform(flatLimitTransformer(10));
    }

    return dist;
  }

  /**
   * Returns the player's attack speed.
   */
  public getAttackSpeed(): number {
    return this.player.equipment.weapon?.speed || DEFAULT_ATTACK_SPEED;
  }

  /**
   * Returns the expected damage per tick, based on the player's attack speed.
   */
  public getDpt() {
    return this.getDistribution().getExpectedDamage() / this.getAttackSpeed();
  }

  /**
   * Returns the damage-per-second calculation, which is the damage-per-tick divided by the number of seconds per tick.
   */
  public getDps() {
    return this.getDpt() / SECONDS_PER_TICK;
  }

  /**
   * Returns the average hits-to-kill calculation.
   */
  public getHtk() {
    const dist = this.getDistribution();
    const hist = dist.asHistogram();
    const max = dist.getMax();

    let htk = new Float64Array(this.monster.skills.hp + 1); // 0 hits left to do if hp = 0

    for (let hp = 1; hp <= this.monster.skills.hp; hp++) {
      let val = 1.0; // takes at least one hit
      for (let hit = 1; hit <= Math.min(hp, max); hit++) {
        let p = hist[hit];
        val += p.chance * htk[hp - hit];
      }

      htk[hp] = val / (1 - hist[0].chance);
    }

    return htk[this.monster.skills.hp];
  }

  /**
   * Returns the average time-to-kill (in seconds) calculation.
   */
  public getTtk() {
    return this.getHtk() * this.getAttackSpeed() * SECONDS_PER_TICK;
  }

  /**
   * Returns a distribution of times-to-kill (in ticks) to probabilities.
   * Because the result will not be densely populated (unless attack speed is 1),
   * it is an object where keys are tick counts and values are probabilities.
   */
  public getTtkDistribution(): Map<number, number> {
    const speed = this.getAttackSpeed();
    const dist = this.getDistribution().asSingleHitplat();

    // distribution of health values at current iter step
    // we don't need to track the 0-health state, but using +1 here removes the need for -1s later on
    let hps = new Float64Array(this.monster.skills.hp + 1);
    hps[this.monster.skills.hp] = 1.0;

    // output map, will be converted at the end
    let ttks = new Map<number, number>();

    // sum of non-zero-health probabilities
    let epsilon = 1.0;

    // 1. until the amount of hp values remaining above zero is more than our desired epsilon accuracy,
    //    or we reach the maximum iteration rounds
    for (let hit = 0; hit < (TTK_DIST_MAX_ITER_ROUNDS + 1) && epsilon > TTK_DIST_EPSILON; hit++) {
      // 2. track the sum total of probability-paths that reach zero on this iteration
      let delta = 0.0;

      const nextHps = new Float64Array(this.monster.skills.hp + 1);

      // 3. for each damage amount possible,
      for (let h of dist.hits) {
        let dmgProb = h.probability;
        let dmg = h.getHitsplats()[0]; // guaranteed to be length 1 from asSingleHitsplat

        // 4. for each possible hp value,
        for (let [hp, hpProb] of hps.entries()) {
          // 5. the chance of this path being reached is the previous chance of landing here * the chance of hitting this amount
          const chanceOfAction = dmgProb * hpProb;
          if (chanceOfAction === 0) continue;

          const newHp = hp - dmg;

          // 6. if the hp we are about to arrive at is <= 0, the npc is killed, the iteration count is hits done,
          //    and we add this probability path into the delta
          if (newHp <= 0) {
            const tick = hit * speed + 1;
            ttks.set(tick, (ttks.get(tick) || 0) + chanceOfAction);
            delta += chanceOfAction;
          }

          // 7. otherwise, we add the chance of this path to the next iteration's hp value
          else {
            nextHps[newHp] += chanceOfAction;
          }
        }
      }

      // 8. update counters and repeat
      epsilon -= delta;
      hps = nextHps;
    }

    return ttks;
  }
}
