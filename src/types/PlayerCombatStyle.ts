import { EquipmentCategory } from '@/enums/EquipmentCategory';

// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
export const CombatStyleTypes = [
  'stab',
  'slash',
  'crush',
  'magic',
  'ranged',
] as const;
export type CombatStyleType = typeof CombatStyleTypes[number] | null;
export function isCombatStyleType(s: string | null | undefined): s is CombatStyleType {
  if (s === undefined) {
    return false;
  }
  return s === null || CombatStyleTypes.includes(s as typeof CombatStyleTypes[number]);
}

// The actual player stat is still "ranged" so I'm not placing this in CombatStyleTypes
export const RangedDamageTypes = [
  'light',
  'standard',
  'heavy',
  'mixed',
] as const;
export type RangedDamageType = typeof RangedDamageTypes[number];
export function getRangedDamageType(category: EquipmentCategory): RangedDamageType {
  switch (category) {
    case EquipmentCategory.THROWN:
      return 'light';

    case EquipmentCategory.BOW:
      return 'standard';

    case EquipmentCategory.CROSSBOW:
    case EquipmentCategory.CHINCHOMPA:
      return 'heavy';

    case EquipmentCategory.SALAMANDER:
      return 'mixed';

    default:
      throw new Error(`Not a ranged weapon category: ${category}`);
  }
}

export type CombatStyleStance =
  null |
  'Accurate' |
  'Aggressive' |
  'Autocast' |
  'Controlled' |
  'Defensive' |
  'Defensive Autocast' |
  'Longrange' |
  'Rapid' |
  // Pseudo stances
  'Manual Cast';

export interface PlayerCombatStyle {
  readonly name: string,
  readonly type: CombatStyleType,
  readonly stance: CombatStyleStance,
}

export const DEFAULT_COMBAT_STYLES: PlayerCombatStyle[] = [
  {
    name: 'Punch',
    type: 'crush',
    stance: 'Accurate',
  },
  {
    name: 'Kick',
    type: 'crush',
    stance: 'Aggressive',
  },
  {
    name: 'Block',
    type: 'crush',
    stance: 'Defensive',
  },
];

export const COMBAT_STYLES_BY_CATEGORY: Partial<Record<EquipmentCategory, ReadonlyArray<PlayerCombatStyle>>> = {
  [EquipmentCategory.UNARMED]: DEFAULT_COMBAT_STYLES,
  [EquipmentCategory.TWO_HANDED_SWORD]: [
    {
      name: 'Chop',
      type: 'slash',
      stance: 'Accurate',
    },
    {
      name: 'Slash',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Smash',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'slash',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.BANNER]: [
    {
      name: 'Lunge',
      type: 'stab',
      stance: 'Accurate',
    },
    {
      name: 'Swipe',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Controlled',
    },
    {
      name: 'Block',
      type: 'stab',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.BLADED_STAFF]: [
    {
      name: 'Jab',
      type: 'stab',
      stance: 'Accurate',
    },
    {
      name: 'Swipe',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Fend',
      type: 'crush',
      stance: 'Defensive',
    },
    {
      name: 'Spell',
      type: 'magic',
      stance: 'Defensive Autocast',
    },
    {
      name: 'Spell',
      type: 'magic',
      stance: 'Autocast',
    },
  ],
  [EquipmentCategory.BOW]: [
    {
      name: 'Accurate',
      type: 'ranged',
      stance: 'Accurate',
    },
    {
      name: 'Rapid',
      type: 'ranged',
      stance: 'Rapid',
    },
    {
      name: 'Longrange',
      type: 'ranged',
      stance: 'Longrange',
    },
  ],
  [EquipmentCategory.CROSSBOW]: [
    {
      name: 'Accurate',
      type: 'ranged',
      stance: 'Accurate',
    },
    {
      name: 'Rapid',
      type: 'ranged',
      stance: 'Rapid',
    },
    {
      name: 'Longrange',
      type: 'ranged',
      stance: 'Longrange',
    },
  ],
  [EquipmentCategory.THROWN]: [
    {
      name: 'Accurate',
      type: 'ranged',
      stance: 'Accurate',
    },
    {
      name: 'Rapid',
      type: 'ranged',
      stance: 'Rapid',
    },
    {
      name: 'Longrange',
      type: 'ranged',
      stance: 'Longrange',
    },
  ],
  [EquipmentCategory.GUN]: [
    // {name: 'Aim and Fire', type: '', stance: ''},
    {
      name: 'Kick',
      type: 'crush',
      stance: 'Aggressive',
    },
  ],
  [EquipmentCategory.BULWARK]: [
    {
      name: 'Pummel',
      type: 'crush',
      stance: 'Accurate',
    },
    {
      name: 'Block',
      type: null,
      stance: null,
    },
  ],
  [EquipmentCategory.MULTI_MELEE]: [
    {
      name: 'Poke',
      type: 'stab',
      stance: 'Accurate',
    },
    {
      name: 'Slash',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'slash',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.PARTISAN]: [
    {
      name: 'Stab',
      type: 'stab',
      stance: 'Accurate',
    },
    {
      name: 'Lunge',
      type: 'stab',
      stance: 'Aggressive',
    },
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'stab',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.PICKAXE]: [
    {
      name: 'Spike',
      type: 'stab',
      stance: 'Accurate',
    },
    {
      name: 'Impale',
      type: 'stab',
      stance: 'Aggressive',
    },
    {
      name: 'Smash',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'stab',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.POLEARM]: [
    {
      name: 'Jab',
      type: 'stab',
      stance: 'Controlled',
    },
    {
      name: 'Swipe',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Fend',
      type: 'stab',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.POWERED_STAFF]: [
    {
      name: 'Accurate',
      type: 'magic',
      stance: 'Accurate',
    },
    {
      name: 'Accurate',
      type: 'magic',
      stance: 'Accurate',
    },
    {
      name: 'Longrange',
      type: 'magic',
      stance: 'Longrange',
    },
  ],
  [EquipmentCategory.POWERED_WAND]: [
    {
      name: 'Accurate',
      type: 'magic',
      stance: 'Accurate',
    },
    {
      name: 'Accurate',
      type: 'magic',
      stance: 'Accurate',
    },
    {
      name: 'Longrange',
      type: 'magic',
      stance: 'Longrange',
    },
  ],
  [EquipmentCategory.SALAMANDER]: [
    {
      name: 'Scorch',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Flare',
      type: 'ranged',
      stance: 'Rapid',
    },
    {
      name: 'Blaze',
      type: 'magic',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.CHINCHOMPA]: [
    {
      name: 'Short fuse',
      type: 'ranged',
      stance: 'Accurate',
    },
    {
      name: 'Medium fuse',
      type: 'ranged',
      stance: 'Rapid',
    },
    {
      name: 'Long fuse',
      type: 'ranged',
      stance: 'Longrange',
    },
  ],
  [EquipmentCategory.CLAW]: [
    {
      name: 'Chop',
      type: 'slash',
      stance: 'Accurate',
    },
    {
      name: 'Slash',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Lunge',
      type: 'stab',
      stance: 'Controlled',
    },
    {
      name: 'Block',
      type: 'slash',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.BLUDGEON]: [
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Pummel',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Smash',
      type: 'crush',
      stance: 'Aggressive',
    },
  ],
  [EquipmentCategory.BLUNT]: [
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Accurate',
    },
    {
      name: 'Pummel',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'crush',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.POLESTAFF]: [
    {
      name: 'Bash',
      type: 'crush',
      stance: 'Accurate',
    },
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'crush',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.SPIKED]: [
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Accurate',
    },
    {
      name: 'Pummel',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Spike',
      type: 'stab',
      stance: 'Controlled',
    },
    {
      name: 'Block',
      type: 'crush',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.STAFF]: [
    {
      name: 'Bash',
      type: 'crush',
      stance: 'Accurate',
    },
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Focus',
      type: 'crush',
      stance: 'Defensive',
    },
    {
      name: 'Spell',
      type: 'magic',
      stance: 'Defensive Autocast',
    },
    {
      name: 'Spell',
      type: 'magic',
      stance: 'Autocast',
    },
  ],
  [EquipmentCategory.AXE]: [
    {
      name: 'Chop',
      type: 'slash',
      stance: 'Accurate',
    },
    {
      name: 'Hack',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Smash',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'slash',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.SCYTHE]: [
    {
      name: 'Reap',
      type: 'slash',
      stance: 'Accurate',
    },
    {
      name: 'Chop',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Jab',
      type: 'crush',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'slash',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.SLASH_SWORD]: [
    {
      name: 'Chop',
      type: 'slash',
      stance: 'Accurate',
    },
    {
      name: 'Slash',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Lunge',
      type: 'stab',
      stance: 'Controlled',
    },
    {
      name: 'Block',
      type: 'slash',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.SPEAR]: [
    {
      name: 'Lunge',
      type: 'stab',
      stance: 'Controlled',
    },
    {
      name: 'Swipe',
      type: 'slash',
      stance: 'Controlled',
    },
    {
      name: 'Pound',
      type: 'crush',
      stance: 'Controlled',
    },
    {
      name: 'Block',
      type: 'stab',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.STAB_SWORD]: [
    {
      name: 'Stab',
      type: 'stab',
      stance: 'Accurate',
    },
    {
      name: 'Lunge',
      type: 'stab',
      stance: 'Aggressive',
    },
    {
      name: 'Slash',
      type: 'slash',
      stance: 'Aggressive',
    },
    {
      name: 'Block',
      type: 'stab',
      stance: 'Defensive',
    },
  ],
  [EquipmentCategory.WHIP]: [
    {
      name: 'Flick',
      type: 'slash',
      stance: 'Accurate',
    },
    {
      name: 'Lash',
      type: 'slash',
      stance: 'Controlled',
    },
    {
      name: 'Deflect',
      type: 'slash',
      stance: 'Defensive',
    },
  ],
};

/**
 * Returns the available combat styles when provided an equipment category.
 * @param style
 */
export const getCombatStylesForCategory = (style: EquipmentCategory | null | undefined): ReadonlyArray<PlayerCombatStyle> => {
  if (!style) {
    return DEFAULT_COMBAT_STYLES;
  }

  const ret = [...(COMBAT_STYLES_BY_CATEGORY[style] ?? DEFAULT_COMBAT_STYLES)];

  // Add a psuedo combat style here for manual casting
  ret.push(
    { name: 'Spell', type: 'magic', stance: 'Manual Cast' },
  );
  return ret;
};

export const stanceRequiresSpell = (stance: CombatStyleStance): boolean => {
  switch (stance) {
    case 'Autocast':
    case 'Defensive Autocast':
    case 'Manual Cast':
      return true;

    default:
      return false;
  }
};
