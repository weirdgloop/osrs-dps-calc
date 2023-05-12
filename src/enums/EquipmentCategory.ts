import {PlayerCombatStyle} from '@/types/Player';

/**
 * The category of the weapon being used.
 * @see https://oldschool.runescape.wiki/w/Property:Combat_style
 */
export enum EquipmentCategory {
  NONE = '',
  TWO_HANDED_SWORD = '2h Sword',
  AXE = 'Axe',
  BANNER = 'Banner',
  BLADED_STAFF = 'Bladed Staff',
  BLASTER = 'Blaster',
  BLUDGEON = 'Bludgeon',
  BLUNT = 'Blunt',
  BOW = 'Bow',
  BULWARK = 'Bulwark',
  CHINCHOMPA = 'Chinchompas',
  CLAW = 'Claw',
  CROSSBOW = 'Crossbow',
  DAGGER = 'Dagger',
  GUN = 'Gun',
  PARTISAN = 'Partisan',
  PICKAXE = 'Pickaxe',
  POLEARM = 'Polearm',
  POLESTAFF = 'Polestaff',
  POWERED_STAFF = 'Powered Staff',
  POWERED_WAND = 'Powered Wand',
  SALAMANDER = 'Salamander',
  SCYTHE = 'Scythe',
  SLASH_SWORD = 'Slash Sword',
  SPEAR = 'Spear',
  SPIKED = 'Spiked',
  STAB_SWORD = 'Stab Sword',
  STAFF = 'Staff',
  THROWN = 'Thrown',
  UNARMED = 'Unarmed',
  WHIP = 'Whip',
}

export const MAGIC_WEAPONS = [
  EquipmentCategory.STAFF,
  EquipmentCategory.POWERED_WAND,
  EquipmentCategory.POWERED_STAFF,
  EquipmentCategory.BLADED_STAFF,
  EquipmentCategory.POLESTAFF
]

/**
 * Returns the available combat styles when provided an equipment category.
 * @param style
 */
export const getCombatStylesForCategory = (style: EquipmentCategory): PlayerCombatStyle[] => {
  switch (style) {
    case EquipmentCategory.TWO_HANDED_SWORD:
      return [
        {name: 'Chop', type: 'slash', stance: 'Accurate'},
        {name: 'Slash', type: 'slash', stance: 'Aggressive'},
        {name: 'Smash', type: 'crush', stance: 'Aggressive'},
        {name: 'Block', type: 'slash', stance: 'Defensive'},
      ]
    case EquipmentCategory.BANNER:
      return [
        {name: 'Lunge', type: 'stab', stance: 'Accurate'},
        {name: 'Swipe', type: 'slash', stance: 'Aggressive'},
        {name: 'Pound', type: 'crush', stance: 'Controlled'},
        {name: 'Block', type: 'stab', stance: 'Defensive'},
      ]
    case EquipmentCategory.BLADED_STAFF:
      return [
        {name: 'Jab', type: 'stab', stance: 'Accurate'},
        {name: 'Swipe', type: 'slash', stance: 'Aggressive'},
        {name: 'Fend', type: 'crush', stance: 'Defensive'},
        {name: 'Spell', type: 'magic', stance: 'Defensive Autocast'},
        {name: 'Spell', type: 'magic', stance: 'Autocast'},
      ]
    case EquipmentCategory.BLASTER:
      // TODO?
      return []
    case EquipmentCategory.BOW:
    case EquipmentCategory.CROSSBOW:
    case EquipmentCategory.THROWN:
      return [
        {name: 'Accurate', type: 'ranged', stance: 'Accurate'},
        {name: 'Rapid', type: 'ranged', stance: 'Rapid'},
        {name: 'Longrange', type: 'ranged', stance: 'Longrange'},
      ]
    case EquipmentCategory.GUN:
      return [
        // {name: 'Aim and Fire', type: '', stance: ''},
        {name: 'Kick', type: 'crush', stance: 'Aggressive'},
      ]
    case EquipmentCategory.BULWARK:
      return [
        {name: 'Pummel', type: 'crush', stance: 'Accurate'},
        // {name: 'Block', type: '', stance: ''},
      ]
    case EquipmentCategory.PARTISAN:
      return [
        {name: 'Stab', type: 'stab', stance: 'Accurate'},
        {name: 'Lunge', type: 'stab', stance: 'Aggressive'},
        {name: 'Pound', type: 'crush', stance: 'Aggressive'},
        {name: 'Block', type: 'stab', stance: 'Defensive'},
      ]
    case EquipmentCategory.PICKAXE:
      return [
        {name: 'Spike', type: 'stab', stance: 'Accurate'},
        {name: 'Impale', type: 'stab', stance: 'Aggressive'},
        {name: 'Smash', type: 'crush', stance: 'Aggressive'},
        {name: 'Block', type: 'stab', stance: 'Defensive'},
      ]
    case EquipmentCategory.POLEARM:
      return [
        {name: 'Jab', type: 'stab', stance: 'Controlled'},
        {name: 'Swipe', type: 'slash', stance: 'Aggressive'},
        {name: 'Fend', type: 'stab', stance: 'Defensive'},
      ]
    case EquipmentCategory.POWERED_STAFF:
    case EquipmentCategory.POWERED_WAND:
      return [
        {name: 'Accurate', type: 'magic', stance: 'Accurate'},
        {name: 'Accurate', type: 'magic', stance: 'Accurate'},
        {name: 'Longrange', type: 'magic', stance: 'Longrange'},
      ]
    case EquipmentCategory.SALAMANDER:
      return [
        {name: 'Scorch', type: 'slash', stance: 'Aggressive'},
        {name: 'Flare', type: 'ranged', stance: 'Accurate'},
        {name: 'Blaze', type: 'magic', stance: 'Defensive'},
      ]
    case EquipmentCategory.CHINCHOMPA:
      return [
        {name: 'Short fuse', type: 'ranged', stance: 'Short fuse'},
        {name: 'Medium fuse', type: 'ranged', stance: 'Medium fuse'},
        {name: 'Long fuse', type: 'ranged', stance: 'Long fuse'},
      ]
    case EquipmentCategory.CLAW:
      return [
        {name: 'Chop', type: 'slash', stance: 'Accurate'},
        {name: 'Slash', type: 'slash', stance: 'Aggressive'},
        {name: 'Lunge', type: 'stab', stance: 'Controlled'},
        {name: 'Block', type: 'slash', stance: 'Defensive'},
      ]
    case EquipmentCategory.BLUDGEON:
      return [
        {name: 'Pound', type: 'crush', stance: 'Aggressive'},
        {name: 'Pummel', type: 'crush', stance: 'Aggressive'},
        {name: 'Smash', type: 'crush', stance: 'Aggressive'}
      ]
    case EquipmentCategory.BLUNT:
      return [
        {name: 'Pound', type: 'crush', stance: 'Accurate'},
        {name: 'Pummel', type: 'crush', stance: 'Aggressive'},
        {name: 'Block', type: 'crush', stance: 'Defensive'}
      ]
    case EquipmentCategory.POLESTAFF:
      return [
        {name: 'Bash', type: 'crush', stance: 'Accurate'},
        {name: 'Pound', type: 'crush', stance: 'Aggressive'},
        {name: 'Block', type: 'crush', stance: 'Defensive'},
      ]
    case EquipmentCategory.SPIKED:
      return [
        {name: 'Pound', type: 'crush', stance: 'Accurate'},
        {name: 'Pummel', type: 'crush', stance: 'Aggressive'},
        {name: 'Spike', type: 'stab', stance: 'Controlled'},
        {name: 'Block', type: 'crush', stance: 'Defensive'},
      ]
    case EquipmentCategory.STAFF:
      return [
        {name: 'Bash', type: 'crush', stance: 'Accurate'},
        {name: 'Pound', type: 'crush', stance: 'Aggressive'},
        {name: 'Focus', type: 'crush', stance: 'Defensive'},
        {name: 'Spell', type: 'magic', stance: 'Defensive Autocast'},
        {name: 'Spell', type: 'magic', stance: 'Autocast'},
      ]
    case EquipmentCategory.AXE:
      return [
        {name: 'Chop', type: 'slash', stance: 'Accurate'},
        {name: 'Hack', type: 'slash', stance: 'Aggressive'},
        {name: 'Smash', type: 'crush', stance: 'Aggressive'},
        {name: 'Block', type: 'slash', stance: 'Defensive'},
      ]
    case EquipmentCategory.NONE:
    case EquipmentCategory.UNARMED:
      return [
        {name: 'Kick', type: 'crush', stance: 'Aggressive'},
        {name: 'Punch', type: 'crush', stance: 'Accurate'},
        {name: 'Block', type: 'crush', stance: 'Defensive'}
      ];
    case EquipmentCategory.SCYTHE:
      return [
        {name: 'Reap', type: 'slash', stance: 'Accurate'},
        {name: 'Chop', type: 'slash', stance: 'Aggressive'},
        {name: 'Jab', type: 'crush', stance: 'Aggressive'},
        {name: 'Block', type: 'slash', stance: 'Defensive'},
      ]
    case EquipmentCategory.SLASH_SWORD:
      return [
        {name: 'Chop', type: 'slash', stance: 'Accurate'},
        {name: 'Slash', type: 'slash', stance: 'Aggressive'},
        {name: 'Lunge', type: 'stab', stance: 'Controlled'},
        {name: 'Block', type: 'slash', stance: 'Defensive'},
      ]
    case EquipmentCategory.SPEAR:
      return [
        {name: 'Lunge', type: 'stab', stance: 'Controlled'},
        {name: 'Swipe', type: 'slash', stance: 'Controlled'},
        {name: 'Pound', type: 'crush', stance: 'Controlled'},
        {name: 'Block', type: 'stab', stance: 'Defensive'},
      ]
    case EquipmentCategory.STAB_SWORD:
      return [
        {name: 'Stab', type: 'stab', stance: 'Accurate'},
        {name: 'Lunge', type: 'stab', stance: 'Aggressive'},
        {name: 'Slash', type: 'slash', stance: 'Aggressive'},
        {name: 'Block', type: 'stab', stance: 'Defensive'},
      ]
    case EquipmentCategory.WHIP:
      return [
        {name: 'Flick', type: 'slash', stance: 'Accurate'},
        {name: 'Lash', type: 'slash', stance: 'Controlled'},
        {name: 'Deflect', type: 'slash', stance: 'Defensive'},
      ]
    default:
      return [];
  }
}