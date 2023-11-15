import {EquipmentPiece, PlayerComputed} from '@/types/Player';
import {Monster} from '@/types/Monster';
import {AttackDistribution, HitDistribution} from "@/lib/HitDist";
import {isFireSpell} from "@/types/Spell";
import {PrayerMap} from "@/enums/Prayer";
import {sum} from "d3-array";

const DEFAULT_ATTACK_SPEED = 4;
const SECONDS_PER_TICK = 0.6;

export default class CombatCalc {
  private player: PlayerComputed;
  private monster: Monster;

  // Array of the names of all equipped items (for quick checks)
  private allEquippedItems: string[];

  private memoizedDist: AttackDistribution | undefined = undefined;

  constructor(player: PlayerComputed, monster: Monster) {
    this.player = player;
    this.monster = monster;

    this.allEquippedItems = Object.values(player.equipment).filter((v) => v !== null).flat(1).map((eq: EquipmentPiece | null) => eq?.name || '');
  }

  /**
   * Simple utility function for checking if an item name is equipped. If an array of string is passed instead, this
   * function will return a boolean indicating whether ANY of the provided items are equipped.
   * @param item
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
   * @param items
   */
  private wearingAll(items: string[]) {
    return items.every((i) => this.allEquippedItems.includes(i));
  }

  private isWearingMeleeVoid(): boolean {
    return this.wearingAll(['Void melee helm', 'Void knight top', 'Void knight robe', 'Void knight gloves']);
  }

  private isWearingEliteRangedVoid(): boolean {
    return this.wearingAll(['Void ranged helm', 'Elite void top', 'Elite void robe', 'Void knight gloves']);
  }

  private isWearingEliteMagicVoid(): boolean {
    return this.wearingAll(['Void magic helm', 'Elite void top', 'Elite void robe', 'Void knight gloves']);
  }

  private isWearingRangedVoid(): boolean {
    return this.wearingAll(['Void ranger helm', 'Void knight top', 'Void knight robe', 'Void knight gloves']);
  }

  private isWearingMagicVoid(): boolean {
    return this.wearingAll(['Void magic helm', 'Void knight top', 'Void knight robe', 'Void knight gloves']);
  }

  private isWearingBlackMask(): boolean {
    return this.wearing('Black mask');
  }

  private isWearingImbuedBlackMask(): boolean {
    return this.wearing('Black mask (i)');
  }

  private isWearingTzhaarWeapon(): boolean {
    return this.wearing(["Tzhaar-ket-em", "Tzhaar-ket-om", "Tzhaar-ket-om (t)", "Toktz-xil-ak", "Toktz-xil-ek"]);
  }

  private isWearingObsidian(): boolean {
    return this.wearingAll(['Obsidian helmet', 'Obsidian platelegs', 'Obsidian platebody']);
  }

  private isWearingCrystalBow(): boolean {
    return this.wearing('Crystal bow') || this.allEquippedItems.some((ei) => ei.includes('Bow of faerdhinen'));
  }

  private isWearingFang(): boolean {
    return this.wearing(["Osmumten's fang", "Osmumten's fang (or)"]);
  }

  private isWearingScythe(): boolean {
    return this.wearing('Scythe of vitur') || this.allEquippedItems.some((ei) => ei.includes('of vitur'));
  }

  private isWearingKeris(): boolean {
    return this.allEquippedItems.some((ei) => ei.includes('Keris'));
  }
  
  private isUsingGodSpell(): boolean {
    return ['Saradomin Strike', 'Claws of Guthix', 'Flames of Zamorak'].includes(this.player.spell.name);
  }

  /**
   * Get the NPC defence roll for this loadout, which is based on the player's current combat style
   */
  public getNPCDefenceRoll(): number {
    const effectiveLevel = this.monster.skills.def + 9;
    let defenceRoll = effectiveLevel * (this.monster.defensive[this.player.style.type] + 64);

    if (this.monster.invocationLevel) {
      defenceRoll = defenceRoll * (250 + this.monster.invocationLevel) / 250;
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
    if (this.wearing(['Salve amulet (e), Salve amulet(ei)']) && mattrs.includes('undead')) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes('undead')) {
      attackRoll = Math.trunc(attackRoll * 7/6);
    } else if (this.isWearingBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 7/6);
    }

    if (this.wearing(["Viggora's chainmace", 'Ursine chainmace']) && buffs.inWilderness) {
      attackRoll = Math.trunc(attackRoll * 3/2);
    }
    if (this.wearing('Arclight') && mattrs.includes('demonic')) {
      attackRoll = Math.trunc(attackRoll * 17/10);
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes('draconic')) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    }
    if (this.wearing('Keris partisan of breaching') && mattrs.includes('kalphite')) {
      attackRoll = Math.trunc(attackRoll * 133/100);
    }
    if (this.wearing(['Blisterwood flail', 'Blisterwood sickle']) && mattrs.includes('vampyre')) {
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
    if (this.wearing(['Salve amulet (e)', 'Salve amulet(ei)']) && mattrs.includes('undead')) {
      maxHit = Math.trunc(maxHit * 6/5);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes('undead')) {
      maxHit = Math.trunc(maxHit * 7/6);
    } else if (this.isWearingBlackMask() && buffs.onSlayerTask) {
      maxHit = Math.trunc(maxHit * 7/6);
    }

    if (this.wearing('Arclight') && mattrs.includes('demonic')) {
      maxHit = Math.trunc(maxHit * 17/10);
    }
    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      maxHit = Math.trunc(baseDmg / 10); // TODO: confirm that this is the appropriate place
    }
    if (this.isWearingTzhaarWeapon() && this.wearing('Berserker necklace')) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes('draconic')) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if (this.isWearingKeris() && mattrs.includes('kalphite')) {
      maxHit = Math.trunc(maxHit * 133/100);
    }
    if (this.wearing('Barronite mace') && mattrs.includes('golem')) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if (this.wearing(["Viggora's chainmace", 'Ursine chainmace']) && buffs.inWilderness) {
      maxHit = Math.trunc(maxHit * 3/2);
    }
    if (this.wearing(['Silverlight', 'Darklight', 'Silverlight (dyed)']) && mattrs.includes('demonic')) {
      maxHit = Math.trunc(maxHit * 8/5);
    }
    if (this.wearing('Blisterwood flail') && mattrs.includes('vampyre')) {
      maxHit = Math.trunc(maxHit * 5/4);
    }
    if (this.wearing('Blisterwood sickle') && mattrs.includes('vampyre')) {
      maxHit = Math.trunc(maxHit * 23/20);
    }
    if (this.wearing('Ivandis flail') && mattrs.includes('vampyre')) {
      maxHit = Math.trunc(maxHit * 6/5);
    }
    if (this.wearing('Leaf-bladed battleaxe') && mattrs.includes('leafy')) {
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

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const buffs = this.player.buffs;

    if (this.wearing('Salve amulet(ei)') && mattrs.includes('undead')) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes('undead')) {
      attackRoll = Math.trunc(attackRoll * 7/6);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 23/20);
    }

    if (this.wearing('Twisted bow')) {
      let cap = 250;
      if (mattrs.includes('raids')) cap = 350;

      let tbowMagic = Math.max(this.monster.skills.magic, this.monster.offensive.magic);
      let m = Math.trunc(Math.min(tbowMagic, cap) * 3/10);
      let tbowMod = Math.trunc(Math.min(140, (140 + (m*10-10)/100 - (m-100)^2/100)));
      attackRoll = Math.trunc(attackRoll * tbowMod / 100);
    }
    if (this.wearing("Craw's bow") && buffs.inWilderness) {
      attackRoll = Math.trunc(attackRoll * 3/2);
    }
    if (this.wearing('Dragon hunter crossbow')) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      attackRoll = Math.trunc(attackRoll * 13/10);
    }
    if (this.isWearingCrystalBow()) {
      let crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      attackRoll = Math.trunc(attackRoll * (20 + crystalPieces) / 20);
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

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;

    if (this.wearing('Twisted bow')) {
      let cap = 250;
      if (mattrs.includes('raids')) cap = 350;

      let tbowMagic = Math.max(this.monster.skills.magic, this.monster.offensive.magic);
      let m = Math.trunc(Math.min(tbowMagic, cap) * 3/10);
      let tbowMod = Math.trunc(Math.min(250, 250 + (m*10-14)/100 - (m-140)^2/100));
      maxHit = Math.trunc(maxHit * tbowMod / 100);
    }
    if (this.wearing("Craw's bow")) {
      maxHit = Math.trunc(maxHit * 3/2);
    }
    if (this.wearing('Dragon hunter crossbow')) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      maxHit = Math.trunc(maxHit * 5/4);
    }
    if (this.isWearingCrystalBow()) {
      let crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      maxHit = Math.trunc(maxHit * (40 + crystalPieces) / 40);
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
      magicBonus = magicBonus * (mattrs.includes('toa') ? 4 : 3);
    }

    let attackRoll = effectiveLevel * (magicBonus + 64);

    if (this.wearing('Salve amulet(ei)') && mattrs.includes('undead')) {
      attackRoll = Math.trunc(attackRoll * 6/5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes('undead')) {
      attackRoll = Math.trunc(attackRoll * 23/20);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 23/20);
    }

    if (this.wearing(["Thammaron's sceptre", "Accursed sceptre"]) && buffs.inWilderness) {
      attackRoll = Math.trunc(attackRoll * 3/2);
    }
    if (this.wearing('Mystic smoke staff') && this.player.spell.spellbook === 'standard') {
      attackRoll = Math.trunc(attackRoll * 11/10);
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
      magicDmgBonus = magicDmgBonus * (mattrs.includes('toa') ? 4 : 3);
    }

    if (this.isWearingEliteMagicVoid()) {
      magicDmgBonus = magicDmgBonus + 25;
    }
    if (this.wearing('Mystic smoke staff') && spell.spellbook === 'standard') {
      magicDmgBonus = magicDmgBonus + 100;
    }

    let blackMaskBonus = false;
    if (this.wearing('Salve amulet(ei)') && mattrs.includes('undead')) {
      magicDmgBonus = magicDmgBonus + 200;
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes('undead')) {
      magicDmgBonus = magicDmgBonus + 150;
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      blackMaskBonus = true;
    }

    maxHit = Math.trunc(maxHit * (1000 + magicDmgBonus) / 1000);

    if (blackMaskBonus) maxHit = Math.trunc(maxHit * 23/20);

    return maxHit;
  }

  private getPrayerBonus(accuracy: boolean): number {
    let prayers = this.player.prayers.map(p => PrayerMap[p]);
    switch (this.player.style.type) {
      case "stab":
      case "slash":
      case "crush":
        prayers = prayers.filter(p => p.combatStyle === "melee");
        break;

      case "ranged":
        prayers = prayers.filter(p => p.combatStyle === "ranged");
        break;
        
      case "magic":
        prayers = prayers.filter(p => p.combatStyle === "magic");
        break;
    }
    
    return 1 + sum(prayers.map(p => accuracy ? p.factorAccuracy : p.factorStrength));
  }

  /**
   * Get the max hit for this loadout, which is based on the player's current combat style
   */
  private getMaxHit() {
    const style = this.player.style.type;
    switch (style) {
      case 'crush':
      case 'slash':
      case 'stab':
        return this.getPlayerMaxMeleeHit();
      case 'ranged':
        return this.getPlayerMaxRangedHit();
      case 'magic':
        return this.getPlayerMaxMagicHit();
    }
  }

  /**
   * Get the max attack roll for this loadout, which is based on the player's current combat style
   */
  public getMaxAttackRoll() {
    const style = this.player.style.type;
    switch (style) {
      case 'crush':
      case 'slash':
      case 'stab':
        return this.getPlayerMaxMeleeAttackRoll();
      case 'ranged':
        return this.getPlayerMaxRangedAttackRoll();
      case 'magic':
        return this.getPlayerMaxMagicAttackRoll();
    }
  }

  public getHitChance() {
    const atk = this.getMaxAttackRoll();
    const def = this.getNPCDefenceRoll();

    const hitChance = (atk > def)
        ? 1 - ((def + 2) / (2 * (atk + 1)))
        : atk / (2 * (def + 1));
    
      if (this.isWearingFang()) {
          if (this.monster.attributes.includes('toa')) {
              return (atk > def)
                  ? 1 - (def + 2) * (2 * def + 3) / (atk + 1) / (atk + 1) / 6
                  : atk * (4 * atk + 5) / 6 / (atk + 1) / (def + 1);
          } else {
              return 1 - Math.pow(1 - hitChance, 2);
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
      dist = new AttackDistribution(
          [HitDistribution.linear(acc, Math.floor(max * 3 / 20), Math.floor(max * 17 / 20))],
      )
    }
    
    if (this.isWearingScythe()) {
      const hits: HitDistribution[] = [];
      for (let i = 1; i < Math.min(Math.max(this.monster.size, 1), 3); i++) {
        hits.push(HitDistribution.linear(acc, 0, Math.floor(max / (Math.pow(2, i)))));
      }
      dist = new AttackDistribution(hits);
    }

    if (this.isWearingKeris() && mattrs.includes('kalphite')) {
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
    
    return dist;
  }

  public getDpt() {
    return this.getDistribution().getExpectedDamage() / 
        (this.player.equipment.weapon?.speed || DEFAULT_ATTACK_SPEED);
  }

  public getDps() {
    return this.getDpt() / SECONDS_PER_TICK;
  }
}