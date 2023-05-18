// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
import {EquipmentCategory} from "@/enums/EquipmentCategory";

export type CombatStyleType = 'slash' | 'crush' | 'stab' | 'magic' | 'ranged';

export interface PlayerCombatStyle {
    name: string,
    type: CombatStyleType,
    stance: string,
}

export const CombatStyleMap: {[k in EquipmentCategory]: {[k: string]: {image: string}}} = {
    [EquipmentCategory.BLASTER]: {
        'Flamer': {image: '36'},
        'Explosive': {image: '47'},
    },
    [EquipmentCategory.GUN]: {
        'Aim and Fire': {image: '128'},
    },
    [EquipmentCategory.AXE]: {
        'Block': {image: '233'},
        'Chop': {image: '234'},
        'Hack': {image: '235'},
        'Smash': {image: '236'},
    },
    [EquipmentCategory.TWO_HANDED_SWORD]: {
        'Block': {image: '237'},
        'Smash': {image: '238'},
        'Slash': {image: '238'},
        'Chop': {image: '239'},
    },
    [EquipmentCategory.PARTISAN]: {
        'Block': {image: '237'},
        'Pound': {image: '238'},
        'Lunge': {image: '239'},
        'Stab': {image: '240'},
    },
    [EquipmentCategory.SLASH_SWORD]: {
        'Block': {image: '237'},
        'Slash': {image: '238'},
        'Chop': {image: '239'},
        'Lunge': {image: '240'},
    },
    [EquipmentCategory.STAB_SWORD]: {
        'Block': {image: '237'},
        'Slash': {image: '238'},
        'Lunge': {image: '239'},
        'Stab': {image: '240'},
    },
    [EquipmentCategory.BANNER]: {
        'Lunge': {image: '241'},
        'Pound': {image: '242'},
        'Block': {image: '250'},
        'Swipe': {image: '251'},
    },
    [EquipmentCategory.SPEAR]: {
        'Lunge': {image: '241'},
        'Pound': {image: '242'},
        'Block': {image: '250'},
        'Swipe': {image: '251'},
    },
    [EquipmentCategory.SPIKED]: {
        'Block': {image: '243'},
        'Pummel': {image: '244'},
        'Spike': {image: '245'},
        'Pound': {image: '246'},
    },
    [EquipmentCategory.UNARMED]: {
        'Punch': {image: '247'},
        'Kick': {image: '248'},
        'Block': {image: '249'},
    },
    [EquipmentCategory.STAFF]: {
        'Focus': {image: '252'},
        'Bash': {image: '266'},
        'Pound': {image: '267'},
    },
    [EquipmentCategory.BLADED_STAFF]: {
        'Fend': {image: '252'},
        'Jab': {image: '266'},
        'Swipe': {image: '267'},
    },
    [EquipmentCategory.POLESTAFF]: {
        'Block': {image: '252'},
        'Bash': {image: '266'},
        'Pound': {image: '267'},
    },
    [EquipmentCategory.BLUDGEON]: {
        'Smash': {image: '253'},
        'Pound': {image: '255'},
        'Pummel': {image: '256'},
    },
    [EquipmentCategory.BLUNT]: {
        'Block': {image: '253'},
        'Pound': {image: '255'},
        'Pummel': {image: '256'},
    },
    [EquipmentCategory.BULWARK]: {
        'Block': {image: '253'},
        'Pummel': {image: '254'},
    },
    [EquipmentCategory.CROSSBOW]: {
        'Accurate': {image: '258'},
        'Rapid': {image: '259'},
        'Longrange': {image: '260'},
    },
    [EquipmentCategory.SCYTHE]: {
        'Block': {image: '261'},
        'Chop': {image: '262'},
        'Reap': {image: '271'},
        'Jab': {image: '271'},
    },
    [EquipmentCategory.POWERED_STAFF]: {
        'Accurate': {image: '263'},
        'Longrange': {image: '265'},
    },
    [EquipmentCategory.POWERED_WAND]: {
        'Accurate': {image: '263'},
        'Longrange': {image: '265'},
    },
    [EquipmentCategory.THROWN]: {
        'Accurate': {image: '263'},
        'Rapid': {image: '264'},
        'Longrange': {image: '265'},
    },
    [EquipmentCategory.BOW]: {
        'Accurate': {image: '268'},
        'Rapid': {image: '269'},
        'Longrange': {image: '270'},
    },
    [EquipmentCategory.PICKAXE]: {
        'Block': {image: '273'},
        'Spike': {image: '274'},
        'Smash': {image: '275'},
        'Impale': {image: '276'},
    },
    [EquipmentCategory.CLAW]: {
        'Lunge': {image: '277'},
        'Slash': {image: '278'},
        'Chop': {image: '279'},
        'Block': {image: '280'},
    },
    [EquipmentCategory.CHINCHOMPA]: {
        'Long fuse': {image: '281'},
        'Medium fuse': {image: '282'},
        'Short fuse': {image: '288'},
    },
    [EquipmentCategory.POLEARM]: {
        'Fend': {image: '283'},
        'Jab': {image: '284'},
        'Swipe': {image: '285'},
    },
    [EquipmentCategory.WHIP]: {
        'Flick': {image: '286'},
        'Deflect': {image: '286'},
        'Lash': {image: '287'},
    },
    [EquipmentCategory.SALAMANDER]: {
        'Scorch': {image: '289'},
        'Flare': {image: '290'},
        'Blaze': {image: '291'},
    },
    [EquipmentCategory.DAGGER]: {},
    [EquipmentCategory.NONE]: {
        'Punch': {image: '247'},
        'Kick': {image: '248'},
        'Block': {image: '249'},
    },
}