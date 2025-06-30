import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc,
  findEquipmentById, findSpell,
  getTestMonsterById,
  getTestPlayer,
} from '@/tests/utils/TestUtils';
import { Prayer } from '@/enums/Prayer';

// Generated tests by https://github.com/LlemonDuck/wiki-calc-test-caser
// Ideally it is better to override Player.bonuses and Player.offensive to prevent flakiness,
// but these are very quick to add and give us a good sense of matching in-game situations.

describe('Generated tests', () => {
  test('Osmumten\'s fang in max melee', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(26382),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(26219),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(50);
  });

  test('Osmumten\'s fang with salve in max melee', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(26382),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(12018),
        weapon: findEquipmentById(26219),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(57);
  });

  test('Osmumten\'s fang with avarice in max melee', () => {
    const monster = getTestMonsterById(7939); // Revenant knight
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 112,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(26382),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(22557),
        weapon: findEquipmentById(26219),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(58);
  });

  test('Osmumten\'s fang with slayer helmet in max melee', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      buffs: {
        onSlayerTask: true,
      },
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(11865),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(26219),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(56);
  });

  test('Osmumten\'s fang in void', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(11665),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(26219),
        body: findEquipmentById(13072),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(47);
  });

  test('Osmumten\'s fang with salve in void', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(11665),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(12018),
        weapon: findEquipmentById(26219),
        body: findEquipmentById(13072),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(53);
  });

  test('Dragon hunter lance in max melee', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Controlled',
      },
      equipment: {
        head: findEquipmentById(26382),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(22978),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(58);
  });

  test('Blisterwood flail in max melee', () => {
    const monster = getTestMonsterById(9567); // Vanstrom Klause
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Pound',
        type: 'crush',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(26382),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(24699),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(55);
  });

  test('Obsidian sword in obsidian armour', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(21298),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(6523),
        body: findEquipmentById(21301),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(21304),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(46);
  });

  test('Obsidian sword with berserker necklace in obsidian armour', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(21298),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(6523),
        body: findEquipmentById(21301),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(21304),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(46);
  });

  test('Obsidian sword with salve in obsidian armour', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(21298),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(12018),
        weapon: findEquipmentById(6523),
        body: findEquipmentById(21301),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(21304),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(52);
  });

  test('Obsidian sword with avarice in obsidian armour', () => {
    const monster = getTestMonsterById(7939); // Revenant knight
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Lunge',
        type: 'stab',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(21298),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(22557),
        weapon: findEquipmentById(6523),
        body: findEquipmentById(21301),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(21304),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(53);
  });

  test('Viggora\'s chainmace in max melee', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      buffs: {
        inWilderness: true,
      },
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Pummel',
        type: 'crush',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(26382),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(22545),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(73);
  });

  test('Viggora\'s chainmace in void', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      buffs: {
        inWilderness: true,
      },
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Pummel',
        type: 'crush',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(11665),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(19553),
        weapon: findEquipmentById(22545),
        body: findEquipmentById(13072),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(67);
  });

  test('Viggora\'s chainmace with avarice in max melee', () => {
    const monster = getTestMonsterById(7939); // Revenant knight
    const player = getTestPlayer(monster, {
      buffs: {
        inWilderness: true,
      },
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Pummel',
        type: 'crush',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(26382),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(22557),
        weapon: findEquipmentById(22545),
        body: findEquipmentById(26384),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(26386),
        hands: findEquipmentById(22981),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(85);
  });

  test('Viggora\'s chainmace with avarice in void', () => {
    const monster = getTestMonsterById(7939); // Revenant knight
    const player = getTestPlayer(monster, {
      buffs: {
        inWilderness: true,
      },
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 99,
      },
      prayers: [Prayer.PIETY],
      style: {
        name: 'Pummel',
        type: 'crush',
        stance: 'Aggressive',
      },
      equipment: {
        head: findEquipmentById(11665),
        cape: findEquipmentById(21285),
        neck: findEquipmentById(22557),
        weapon: findEquipmentById(22545),
        body: findEquipmentById(13072),
        shield: findEquipmentById(22322),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(13239),
        ring: findEquipmentById(11773),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(78);
  });

  test('Tumeken\'s shadow in max mage', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(21018),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(27275),
        body: findEquipmentById(21021),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(19544),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(65);
  });

  test('Tumeken\'s shadow with salve in max mage', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(21018),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12018),
        weapon: findEquipmentById(27275),
        body: findEquipmentById(21021),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(19544),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(67);
  });

  test('Tumeken\'s shadow with slayer helmet in max mage', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      buffs: {
        onSlayerTask: true,
      },
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(11865),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(27275),
        body: findEquipmentById(21021),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(19544),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(70);
  });

  test('Tumeken\'s shadow in void', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(11663),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(27275),
        body: findEquipmentById(13072),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(51);
  });

  test('Tumeken\'s shadow with salve in void', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      skills: {
        atk: 118,
        str: 118,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(11663),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12018),
        weapon: findEquipmentById(27275),
        body: findEquipmentById(13072),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(53);
  });

  test('Bone staff in max mage', () => {
    const monster = getTestMonsterById(7222); // Scurrius
    const player = getTestPlayer(monster, {
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(21018),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(28796),
        body: findEquipmentById(21021),
        shield: findEquipmentById(25985),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(19544),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(53);
  });

  test('Bone staff with slayer helmet in max mage', () => {
    const monster = getTestMonsterById(1680); // Giant crypt rat
    const player = getTestPlayer(monster, {
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(11865),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(28796),
        body: findEquipmentById(21021),
        shield: findEquipmentById(25985),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(19544),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(59);
  });

  test('Bone staff in void', () => {
    const monster = getTestMonsterById(7222); // Scurrius
    const player = getTestPlayer(monster, {
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Accurate',
        type: 'magic',
        stance: 'Accurate',
      },
      equipment: {
        head: findEquipmentById(11663),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(28796),
        body: findEquipmentById(13072),
        shield: findEquipmentById(25985),
        legs: findEquipmentById(13073),
        hands: findEquipmentById(8842),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(49);
  });

  test('Fire bolt with chaos gauntlets', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      spell: findSpell('Fire Bolt'),
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Spell',
        type: 'magic',
        stance: 'Autocast',
      },
      equipment: {
        head: findEquipmentById(21018),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(11791),
        body: findEquipmentById(21021),
        shield: findEquipmentById(25985),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(777),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(20);
  });

  test('Fire bolt with chaos gauntlets and salve', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      spell: findSpell('Fire Bolt'),
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Spell',
        type: 'magic',
        stance: 'Autocast',
      },
      equipment: {
        head: findEquipmentById(21018),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12018),
        weapon: findEquipmentById(11791),
        body: findEquipmentById(21021),
        shield: findEquipmentById(25985),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(777),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(28);
  });

  test('Fire bolt with chaos gauntlets and tome of fire', () => {
    const monster = getTestMonsterById(415);
    const player = getTestPlayer(monster, {
      spell: findSpell('Fire Bolt'),
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Spell',
        type: 'magic',
        stance: 'Autocast',
      },
      equipment: {
        head: findEquipmentById(21018),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12002),
        weapon: findEquipmentById(11791),
        body: findEquipmentById(21021),
        shield: findEquipmentById(20714),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(777),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(22);
  });

  test('Fire bolt with chaos gauntlets, salve, and tome of fire', () => {
    const monster = getTestMonsterById(8059); // Vorkath
    const player = getTestPlayer(monster, {
      spell: findSpell('Fire Bolt'),
      skills: {
        atk: 99,
        str: 99,
        ranged: 99,
        magic: 112,
      },
      prayers: [],
      style: {
        name: 'Spell',
        type: 'magic',
        stance: 'Autocast',
      },
      equipment: {
        head: findEquipmentById(21018),
        cape: findEquipmentById(21780),
        neck: findEquipmentById(12018),
        weapon: findEquipmentById(11791),
        body: findEquipmentById(21021),
        shield: findEquipmentById(20714),
        legs: findEquipmentById(21024),
        hands: findEquipmentById(777),
        feet: findEquipmentById(13235),
        ring: findEquipmentById(28313),
      },
    });

    const { maxHit } = calculatePlayerVsNpc(monster, player);
    expect(maxHit).toBe(30);
  });
});
