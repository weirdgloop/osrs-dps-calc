import { Edge, Node } from '@xyflow/react';
import raw_dbrow_definitions from './dbrow_definitions.json';

export enum NodeSize {
  Minor = 'node_minor', // 2
  Major = 'node_major', // 1
  Capstone = 'node_capstone', // 3
}

export type LeaguesEffect =
  | 'talent_2h_melee_echos'
  | 'talent_air_spell_damage_active_prayers'
  | 'talent_air_spell_max_hit_prayer_bonus'
  | 'talent_airrune_regen_prayer_restore'
  | 'talent_all_style_accuracy'
  | 'talent_blood_counts_as_fire'
  | 'talent_bow_always_pass_accuracy'
  | 'talent_bow_fast_hits'
  | 'talent_bow_max_hit_stacking_increase'
  | 'talent_bow_min_hit_stacking_increase'
  | 'talent_buffed_ranged_prayers'
  | 'talent_crossbow_double_accuracy_roll'
  | 'talent_crossbow_echo_reproc_chance'
  | 'talent_crossbow_max_hit'
  | 'talent_crossbow_slow_big_hits'
  | 'talent_defence_boost'
  | 'talent_defence_recoil_scaling'
  | 'talent_distance_melee_minhit'
  | 'talent_earth_reduce_defence'
  | 'talent_earth_scale_defence_stat'
  | 'talent_earthrune_regen_defence_boost'
  | 'talent_fire_hp_consume_for_damage'
  | 'talent_fire_spell_burn_bounce'
  | 'talent_firerune_regen_damage_boost'
  | 'talent_free_random_weapon_attack_chance'
  | 'talent_hit_restore_spec_energy'
  | 'talent_ice_counts_as_water'
  | 'talent_light_weapon_doublehit'
  | 'talent_light_weapon_faster'
  | 'talent_magic_attack_speed_powered'
  | 'talent_magic_attack_speed_traditional'
  | 'talent_max_accuracy_roll_from_range'
  | 'talent_max_hit_style_swap'
  | 'talent_melee_distance_healing_chance'
  | 'talent_melee_range_conditional_boost'
  | 'talent_melee_range_multiplier'
  | 'talent_melee_strength_prayer_bonus'
  | 'talent_multi_hit_str_increase'
  | 'talent_offhand_stat_boost'
  | 'talent_overheal_consumption_boost'
  | 'talent_overhealing_via_talents'
  | 'talent_percentage_magic_damage'
  | 'talent_percentage_melee_damage'
  | 'talent_percentage_melee_maxhit_distance'
  | 'talent_percentage_ranged_damage'
  | 'talent_prayer_pen_all'
  | 'talent_prayer_restore_no_overhead'
  | 'talent_ranged_echo_cyclical'
  | 'talent_ranged_regen_echo_chance'
  | 'talent_ranged_strength_hp_difference'
  | 'talent_regen_ammo'
  | 'talent_regen_magic_level_boost'
  | 'talent_regen_stave_charges_air'
  | 'talent_regen_stave_charges_earth'
  | 'talent_regen_stave_charges_fire'
  | 'talent_regen_stave_charges_water'
  | 'talent_restore_sa_energy_from_distance'
  | 'talent_shadow_counts_as_earth'
  | 'talent_shield_block_heal'
  | 'talent_shield_reflect'
  | 'talent_smoke_counts_as_air'
  | 'talent_spec_for_free'
  | 'talent_thorns_damage'
  | 'talent_thorns_double_hit'
  | 'talent_thrown_maxhit_echoes'
  | 'talent_thrown_weapon_accuracy'
  | 'talent_thrown_weapon_melee_str_scale'
  | 'talent_thrown_weapon_multi'
  | 'talent_unique_blindbag_chance'
  | 'talent_unique_blindbag_damage'
  | 'talent_water_spell_bouce_heal'
  | 'talent_water_spell_damage_high_hp'
  | 'talent_waterrune_regen_healing';

export interface SkillTreeNodeInfo {
  draw_coord: {
    x: number;
    y: number;
  };
  name: string;
  row_id: string;
  node_size: NodeSize;
  effect: {
    name: LeaguesEffect;
    value: number;
  };
  node_type?: string;
  linked_nodes: string[];
}

export const getDisplayId = (id: string) => id.replace(/^node/, '');
export const getNodeIdFromDisplay = (displayId: string) => (/^\d+$/.test(displayId) ? `node${displayId}` : displayId);

export const dbrowDefinitions = raw_dbrow_definitions as {
  [key: string]: SkillTreeNodeInfo;
};

export const initialNodes: Node[] = Array.from(Object.entries(dbrowDefinitions)).map(([key, value]) => ({
  id: key,
  type: 'skillTreeNode',
  position: { x: value.draw_coord.x, y: value.draw_coord.y },
  data: {
    label: value.name,
    id: key,
    skillTreeNodeInfo: value,
    isPreview: false,
  },
  selectable: false,
}));

export const initialNodesPreview: Node[] = initialNodes.map((node) => ({
  ...node,
  data: { ...node.data, isPreview: true },
}));

export const rootNode: Node = initialNodes.find((node) => node.position.x === 0 && node.position.y === 0)!;

export const initialEdges: Edge[] = Array.from(Object.entries(dbrowDefinitions)).flatMap(([key, value]) => value.linked_nodes
  .filter((linkedNode) => key < linkedNode)
  .map((linkedNode) => ({
    id: `${key}-${linkedNode}`,
    type: 'skillTreeEdge',
    source: key,
    target: linkedNode,
    selectable: false,
    data: { isPreview: false },
  })));

export const initialEdgesPreview: Edge[] = initialEdges.map((edge) => ({
  ...edge,
  data: { ...edge.data, isPreview: true },
}));
