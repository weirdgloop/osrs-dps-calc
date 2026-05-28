import { EquipmentSlot } from '@/types/Player';

export enum UserIssueType {
  EQUIPMENT_MISSING_AMMO = 'equipment_slot_ammo_missing',
  EQUIPMENT_WRONG_AMMO = 'equipment_slot_ammo_wrong',
  EQUIPMENT_SET_EFFECT_UNSUPPORTED = 'equipment_slot_body_unsupported_set_effect',
  WEAPON_WRONG_MONSTER = 'equipment_slot_weapon_wrong_monster',
  EQUIPMENT_SPEC_UNSUPPORTED = 'pvm_results_weapon_unsupported_spec',
  SPELL_WRONG_WEAPON = 'spell_wrong_weapon',
  SPELL_WRONG_MONSTER = 'spell_wrong_monster',
  MONSTER_UNIQUE_EFFECTS = 'monster_overall_unique_effects',
  RING_RECOIL_UNSUPPORTED = 'equipment_slot_ring_recoil',
  FEET_RECOIL_UNSUPPORTED = 'equipment_slot_feet_recoil',
  HANDS_EFFECT_UNSUPPORTED = 'equipment_slot_hands_effect',
  LEAGUES_SIX_TALENT_UNSUPPORTED = 'leagues_six_talent_unsupported',
}

export interface MonsterIssue {
  id: string;
  type: UserIssueType;
  message: string;
}

export interface EquipmentIssue {
  id: string;
  type: UserIssueType;
  message: string;
  slot: EquipmentSlot;
}

export interface SpellIssue {
  id: string;
  type: UserIssueType;
  message: string;
}

export interface SpecIssue {
  id: string;
  type: UserIssueType;
  message: string;
}
