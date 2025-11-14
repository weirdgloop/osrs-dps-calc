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
  EquipmentCategory.POLESTAFF,
];
