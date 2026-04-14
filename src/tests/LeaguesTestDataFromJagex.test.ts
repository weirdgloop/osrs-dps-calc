/* @eslint-disable */

import {
  describe, expect, test, xtest,
} from '@jest/globals';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { findEquipment, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import { getCombatStylesForCategory } from '@/utils';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { Prayer } from '@/enums/Prayer';

// http://localhost:3000/osrs-dps?id=RupertsPulleyChaos
describe('melee', () => {
  test('nally no echoes', () => {
    const m = getTestMonster('Gemstone Crab', '', { skills: { def: 0 } });
    const p = getTestPlayer(m, {
      equipment: {
        head: findEquipment('Torva full helm'),
        cape: findEquipment('Infernal cape'),
        neck: findEquipment('Amulet of rancour'),
        weapon: findEquipment('Noxious halberd'),
        body: findEquipment('Torva platebody'),
        legs: findEquipment('Torva platelegs'),
        hands: findEquipment('Ferocious gloves'),
        feet: findEquipment('Avernic treads'),
        ring: findEquipment('Ultor ring'),
      },
      style: getCombatStylesForCategory(EquipmentCategory.POLEARM)[1],
      boosts: {
        atk: 19,
        str: 19,
      },
      prayers: [Prayer.PIETY],
      leagues: {
        six: {
          distanceToEnemy: 7,
          blindbagWeapons: [
            findEquipment('Holy scythe of vitur', 'Charged'),
            findEquipment('Holy scythe of vitur', 'Uncharged'),
            findEquipment('Sanguine scythe of vitur', 'Charged'),
            findEquipment('Sanguine scythe of vitur', 'Uncharged'),
            findEquipment('Scythe of vitur', 'Charged'),
          ],
          effects: {
            talent_regen_ammo: 55,
            talent_ranged_regen_echo_chance: 25,
            talent_distance_melee_minhit: 3,
            talent_bow_always_pass_accuracy: 1,
            talent_crossbow_echo_reproc_chance: 15,
            talent_thrown_maxhit_echoes: 20,
            talent_free_random_weapon_attack_chance: 15,
            talent_melee_range_multiplier: 2,
            talent_defence_boost: 10,
            talent_all_style_accuracy: 135,
            talent_max_accuracy_roll_from_range: 1,
            talent_restore_sa_energy_from_distance: 1,
            talent_percentage_ranged_damage: 1,
            talent_percentage_melee_damage: 5,
            talent_ranged_echo_cyclical: 1,
            talent_unique_blindbag_chance: 1,
            talent_overheal_consumption_boost: 1,
            talent_melee_distance_healing_chance: 20,
            talent_percentage_melee_maxhit_distance: 4,
            talent_melee_strength_prayer_bonus: 1,
            talent_unique_blindbag_damage: 2,
            talent_melee_range_conditional_boost: 1,
            talent_multi_hit_str_increase: 1,
          // talent_2h_melee_echos: 1,
          },
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getDps()).toBeCloseTo(26.54, 0);
    console.log({ nhallyNoEchoes: calc.getDps() });
  });

  test('scythe no echoes', () => {
    const m = getTestMonster('Gemstone Crab', '', { skills: { def: 0 } });
    const p = getTestPlayer(m, {
      equipment: {
        head: findEquipment('Torva full helm'),
        cape: findEquipment('Infernal cape'),
        neck: findEquipment('Amulet of rancour'),
        weapon: findEquipment('Scythe of vitur', 'Charged'),
        body: findEquipment('Torva platebody'),
        legs: findEquipment('Torva platelegs'),
        hands: findEquipment('Ferocious gloves'),
        feet: findEquipment('Avernic treads'),
        ring: findEquipment('Ultor ring'),
      },
      style: getCombatStylesForCategory(EquipmentCategory.SCYTHE)[1],
      boosts: {
        atk: 19,
        str: 19,
      },
      prayers: [Prayer.PIETY],
      leagues: {
        six: {
          distanceToEnemy: 2,
          blindbagWeapons: [
            findEquipment('Holy scythe of vitur', 'Charged'),
            findEquipment('Holy scythe of vitur', 'Uncharged'),
            findEquipment('Sanguine scythe of vitur', 'Charged'),
            findEquipment('Sanguine scythe of vitur', 'Uncharged'),
            findEquipment('Scythe of vitur', 'Uncharged'),
          ],
          effects: {
            talent_regen_ammo: 55,
            talent_ranged_regen_echo_chance: 25,
            talent_distance_melee_minhit: 3,
            talent_bow_always_pass_accuracy: 1,
            talent_crossbow_echo_reproc_chance: 15,
            talent_thrown_maxhit_echoes: 20,
            talent_free_random_weapon_attack_chance: 15,
            talent_melee_range_multiplier: 2,
            talent_defence_boost: 10,
            talent_all_style_accuracy: 135,
            talent_max_accuracy_roll_from_range: 1,
            talent_restore_sa_energy_from_distance: 1,
            talent_percentage_ranged_damage: 1,
            talent_percentage_melee_damage: 5,
            talent_ranged_echo_cyclical: 1,
            talent_unique_blindbag_chance: 1,
            talent_overheal_consumption_boost: 1,
            talent_melee_distance_healing_chance: 20,
            talent_percentage_melee_maxhit_distance: 4,
            talent_melee_strength_prayer_bonus: 1,
            talent_unique_blindbag_damage: 2,
            talent_melee_range_conditional_boost: 1,
            talent_multi_hit_str_increase: 1,
          // talent_2h_melee_echos: 1,
          },
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getDps()).toBeCloseTo(25.19, 0);
    console.log({ scyNoEchoes: calc.getDps() });
  });

  // known broken
  xtest('nally echoes', () => {
    const m = getTestMonster('Gemstone Crab', '', { skills: { def: 0 } });
    const p = getTestPlayer(m, {
      equipment: {
        head: findEquipment('Torva full helm'),
        cape: findEquipment('Infernal cape'),
        neck: findEquipment('Amulet of rancour'),
        weapon: findEquipment('Noxious halberd'),
        body: findEquipment('Torva platebody'),
        legs: findEquipment('Torva platelegs'),
        hands: findEquipment('Ferocious gloves'),
        feet: findEquipment('Avernic treads'),
        ring: findEquipment('Ultor ring'),
      },
      style: getCombatStylesForCategory(EquipmentCategory.POLEARM)[1],
      boosts: {
        atk: 19,
        str: 19,
      },
      prayers: [Prayer.PIETY],
      leagues: {
        six: {
          distanceToEnemy: 7,
          blindbagWeapons: [
            findEquipment('Holy scythe of vitur', 'Charged'),
            findEquipment('Holy scythe of vitur', 'Uncharged'),
            findEquipment('Sanguine scythe of vitur', 'Charged'),
            findEquipment('Sanguine scythe of vitur', 'Uncharged'),
            findEquipment('Scythe of vitur', 'Charged'),
          ],
          effects: {
            talent_regen_ammo: 55,
            talent_ranged_regen_echo_chance: 25,
            talent_distance_melee_minhit: 3,
            talent_bow_always_pass_accuracy: 1,
            talent_crossbow_echo_reproc_chance: 15,
            talent_thrown_maxhit_echoes: 20,
            talent_free_random_weapon_attack_chance: 15,
            talent_melee_range_multiplier: 2,
            talent_defence_boost: 10,
            talent_all_style_accuracy: 135,
            talent_max_accuracy_roll_from_range: 1,
            talent_restore_sa_energy_from_distance: 1,
            talent_percentage_ranged_damage: 1,
            talent_percentage_melee_damage: 5,
            talent_ranged_echo_cyclical: 1,
            talent_unique_blindbag_chance: 1,
            talent_overheal_consumption_boost: 1,
            talent_melee_distance_healing_chance: 20,
            talent_percentage_melee_maxhit_distance: 4,
            talent_melee_strength_prayer_bonus: 1,
            talent_unique_blindbag_damage: 2,
            talent_melee_range_conditional_boost: 1,
            talent_multi_hit_str_increase: 1,
            talent_2h_melee_echos: 1,
          },
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getDps()).toBeCloseTo(36.09, 0);
    console.log({ nhallyEchoes: calc.getDps() });
  });

  // known broken
  xtest('scythe echoes', () => {
    const m = getTestMonster('Gemstone Crab', '', { skills: { def: 0 } });
    const p = getTestPlayer(m, {
      equipment: {
        head: findEquipment('Torva full helm'),
        cape: findEquipment('Infernal cape'),
        neck: findEquipment('Amulet of rancour'),
        weapon: findEquipment('Scythe of vitur', 'Charged'),
        body: findEquipment('Torva platebody'),
        legs: findEquipment('Torva platelegs'),
        hands: findEquipment('Ferocious gloves'),
        feet: findEquipment('Avernic treads'),
        ring: findEquipment('Ultor ring'),
      },
      style: getCombatStylesForCategory(EquipmentCategory.SCYTHE)[1],
      boosts: {
        atk: 19,
        str: 19,
      },
      prayers: [Prayer.PIETY],
      leagues: {
        six: {
          distanceToEnemy: 2,
          blindbagWeapons: [
            findEquipment('Holy scythe of vitur', 'Charged'),
            findEquipment('Holy scythe of vitur', 'Uncharged'),
            findEquipment('Sanguine scythe of vitur', 'Charged'),
            findEquipment('Sanguine scythe of vitur', 'Uncharged'),
            findEquipment('Scythe of vitur', 'Uncharged'),
          ],
          effects: {
            talent_regen_ammo: 55,
            talent_ranged_regen_echo_chance: 25,
            talent_distance_melee_minhit: 3,
            talent_bow_always_pass_accuracy: 1,
            talent_crossbow_echo_reproc_chance: 15,
            talent_thrown_maxhit_echoes: 20,
            talent_free_random_weapon_attack_chance: 15,
            talent_melee_range_multiplier: 2,
            talent_defence_boost: 10,
            talent_all_style_accuracy: 135,
            talent_max_accuracy_roll_from_range: 1,
            talent_restore_sa_energy_from_distance: 1,
            talent_percentage_ranged_damage: 1,
            talent_percentage_melee_damage: 5,
            talent_ranged_echo_cyclical: 1,
            talent_unique_blindbag_chance: 1,
            talent_overheal_consumption_boost: 1,
            talent_melee_distance_healing_chance: 20,
            talent_percentage_melee_maxhit_distance: 4,
            talent_melee_strength_prayer_bonus: 1,
            talent_unique_blindbag_damage: 2,
            talent_melee_range_conditional_boost: 1,
            talent_multi_hit_str_increase: 1,
            talent_2h_melee_echos: 1,
          },
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getDps()).toBeCloseTo(35.59, 0);
    console.log({ scyEchoes: calc.getDps() });
  });
});

describe('ranged', () => {
  test('rcb echoes', () => {
    const m = getTestMonster('Gemstone Crab', '', { skills: { def: 0 } });
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Rune crossbow'),
        ammo: findEquipment('Runite bolts', 'Unpoisoned'),
      },
      style: getCombatStylesForCategory(EquipmentCategory.CROSSBOW)[1],
      prayers: [],
      leagues: {
        six: {
          effects: {
            talent_regen_ammo: 50,
            talent_ranged_regen_echo_chance: 25,
            talent_crossbow_echo_reproc_chance: 15,
          },
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getDps()).toBeCloseTo(6.01, 0);
    console.log({ rcbEchoes: calc.getDps() });
  });

  test('ddarts echoes', () => {
    const m = getTestMonster('Gemstone Crab', '', { skills: { def: 0 } });
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Dragon dart', 'Unpoisoned'),
      },
      style: getCombatStylesForCategory(EquipmentCategory.THROWN)[1],
      prayers: [],
      leagues: {
        six: {
          effects: {
            talent_regen_ammo: 50,
            talent_ranged_regen_echo_chance: 25,
            talent_thrown_maxhit_echoes: 20,
          },
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getDps()).toBeCloseTo(8.20, 0);
    console.log({ ddartEchoes: calc.getDps() });
  });

  test('msb echoes', () => {
    const m = getTestMonster('Gemstone Crab', '', { skills: { def: 0 } });
    const p = getTestPlayer(m, {
      equipment: {
        weapon: findEquipment('Magic shortbow'),
        ammo: findEquipment('Rune arrow', 'Unpoisoned'),
      },
      style: getCombatStylesForCategory(EquipmentCategory.BOW)[1],
      prayers: [],
      leagues: {
        six: {
          effects: {
            talent_regen_ammo: 50,
            talent_ranged_regen_echo_chance: 25,
            talent_bow_always_pass_accuracy: 1,
          },
        },
      },
    });

    const calc = new PlayerVsNPCCalc(p, m);
    expect(calc.getDps()).toBeCloseTo(5.75, 0);
    console.log({ msbEchoes: calc.getDps() });
  });
});
