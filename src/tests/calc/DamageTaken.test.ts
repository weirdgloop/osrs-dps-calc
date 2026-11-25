import { describe, expect, test } from '@jest/globals';
import {
  calculateNpcVsPlayer, getTestMonster, getTestPlayer, findEquipment,
} from '@/tests/utils/TestUtils';
import { ACCURACY_PRECISION, DPS_PRECISION } from '@/lib/constants';
import { parseMonsterStyle } from '@/lib/Monsters';

describe('Damage Taken', () => {
  describe('Abyssal demon', () => {
    const monster = getTestMonster('Abyssal demon', 'Standard');

    test('lvl 1 def, no armour', () => {
      const player = getTestPlayer(monster, { skills: { def: 1 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(8);
      expect(result.npcDps).toBeCloseTo(1.596, DPS_PRECISION);
      expect(result.npcMaxAttackRoll).toBe(6784);
      expect(result.playerDefRoll).toBe(576);
      expect(result.npcAccuracy * 100).toBeCloseTo(95.74, ACCURACY_PRECISION);
    });

    test('lvl 99 def, no armour', () => {
      const player = getTestPlayer(monster, { skills: { def: 99 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(8);
      expect(result.npcDps).toBeCloseTo(0.825, DPS_PRECISION);
      expect(result.npcMaxAttackRoll).toBe(6784);
      expect(result.playerDefRoll).toBe(6848);
      expect(result.npcAccuracy * 100).toBeCloseTo(49.53, ACCURACY_PRECISION);
    });
  });

  describe('Bloodveld', () => {
    const monster = getTestMonster('Bloodveld', 'GWD');

    test('monster style is magical melee', () => {
      expect(monster.style).toBe('magical melee');
    });

    test('skills: { def: 99, magic: 1 }', () => {
      const player = getTestPlayer(monster, { skills: { def: 99, magic: 1 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(6);
      expect(result.npcMaxAttackRoll).toBe(5696);
      expect(result.playerDefRoll).toBe(2368);
    });

    test('skills: { def: 99, magic: 99 }', () => {
      const player = getTestPlayer(monster, { skills: { def: 99, magic: 99 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.playerDefRoll).toBe(6784);
    });

    test('skills: { def: 99, magic: 99 }, defensive: { stab: 0, slash: 0, crush: 0, magic: 100, ranged: 0 }', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99, magic: 99 },
        defensive: {
          stab: 0, slash: 0, crush: 0, magic: 100, ranged: 0,
        },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.playerDefRoll).toBe(17384);
    });

    test('skills: { def: 99, magic: 99 }, defensive: { stab: 200, slash: 200, crush: 200, magic: 0, ranged: 0 }', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99, magic: 99 },
        defensive: {
          stab: 200, slash: 200, crush: 200, magic: 0, ranged: 0,
        },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.playerDefRoll).toBe(6784);
    });
  });

  describe('Smoke devil', () => {
    const monster = getTestMonster('Smoke devil');

    test('monster style is magical ranged', () => {
      expect(monster.style).toBe('magical ranged');
    });

    test('skills: { def: 99, magic: 1 }', () => {
      const player = getTestPlayer(monster, { skills: { def: 99, magic: 1 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(20);
      expect(result.npcMaxAttackRoll).toBe(13056);
      expect(result.playerDefRoll).toBe(2368);
    });

    test('skills: { def: 99, magic: 99 }', () => {
      const player = getTestPlayer(monster, { skills: { def: 99, magic: 99 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.playerDefRoll).toBe(6784);
    });
  });

  describe('Thermonuclear smoke devil', () => {
    const monster = getTestMonster('Thermonuclear smoke devil');

    test('monster style is magical ranged', () => {
      expect(monster.style).toBe('magical ranged');
    });

    test('skills: { def: 99, magic: 1 }', () => {
      const player = getTestPlayer(monster, { skills: { def: 99, magic: 1 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(8);
      expect(result.npcMaxAttackRoll).toBe(20416);
      expect(result.playerDefRoll).toBe(2368);
    });

    test('skills: { def: 99, magic: 99 }', () => {
      const player = getTestPlayer(monster, { skills: { def: 99, magic: 99 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.playerDefRoll).toBe(6784);
    });
  });

  describe('Dust devil', () => {
    const monster = getTestMonster('Dust devil', 'Catacombs of Kourend');

    test('monster style is ranged melee', () => {
      expect(monster.style).toBe('ranged melee');
    });

    test('without head gear, skills: { def: 99, magic: 1 }, defensive: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 100 }', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99, magic: 1 },
        defensive: {
          stab: 0, slash: 0, crush: 0, magic: 0, ranged: 100,
        },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(10);
      expect(result.npcMaxAttackRoll).toBe(8256);
      expect(result.playerDefRoll).toBe(17548);
    });

    test('wearing Slayer helmet in head slot', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99, magic: 1 },
        equipment: { head: findEquipment('Slayer helmet') },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(8);
    });

    test('skills: { def: 99, magic: 99 }, defensive: { stab: 200, slash: 200, crush: 200, magic: 200, ranged: 0 }', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99, magic: 99 },
        defensive: {
          stab: 200, slash: 200, crush: 200, magic: 200, ranged: 0,
        },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.playerDefRoll).toBe(6848);
    });
  });

  describe('Torcher', () => {
    const monster = getTestMonster('Torcher', 'Level 33');

    test('monster style is ranged magic', () => {
      expect(monster.style).toBe('ranged magic');
    });

    test('skills: { def: 99, magic: 1 }, defensive: { stab: 0, slash: 0, crush: 0, magic: 0, ranged: 100 }', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99, magic: 1 },
        defensive: {
          stab: 0, slash: 0, crush: 0, magic: 0, ranged: 100,
        },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(6);
      expect(result.npcMaxAttackRoll).toBe(3520);
      expect(result.playerDefRoll).toBe(17548);
    });

    test('skills: { def: 99, magic: 99 }, defensive: { stab: 0, slash: 0, crush: 0, magic: 200, ranged: 0 }', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99, magic: 99 },
        defensive: {
          stab: 0, slash: 0, crush: 0, magic: 200, ranged: 0,
        },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.playerDefRoll).toBe(6848);
    });
  });

  describe('excluded non-standard monsters', () => {
    test('Chaos Fanatic', () => {
      expect(getTestMonster('Chaos Fanatic').style).toBeNull();
    });

    test('Kraken', () => {
      expect(getTestMonster('Kraken', 'Kraken').style).toBeNull();
    });

    test('Kraken whirlpool', () => {
      expect(getTestMonster('Kraken', 'Whirlpool').style).toBeNull();
    });
  });

  describe('Gorak', () => {
    const monster = getTestMonster('Gorak', 'GWD');

    test('monster style is crush', () => {
      expect(monster.style).toBe('crush');
    });

    test('skills: { def: 99 }, defensive: { stab: 0, slash: 0, crush: 100, magic: 0, ranged: 0 }', () => {
      const player = getTestPlayer(monster, {
        skills: { def: 99 },
        defensive: {
          stab: 0, slash: 0, crush: 100, magic: 0, ranged: 0,
        },
      });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(14);
      expect(result.npcMaxAttackRoll).toBe(9088);
      expect(result.playerDefRoll).toBe(17548);
    });
  });

  describe('Dusk', () => {
    const monster = getTestMonster('Dusk', 'First form');

    test('monster style is slash', () => {
      expect(monster.style).toBe('slash');
    });

    test('npcMaxHit 15, npcMaxAttackRoll 13376', () => {
      const player = getTestPlayer(monster, { skills: { def: 99 } });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcMaxHit).toBe(15);
      expect(result.npcMaxAttackRoll).toBe(13376);
    });
  });

  describe('parseMonsterStyle', () => {
    test('standard styles', () => {
      expect(parseMonsterStyle(['Crush'])).toBe('crush');
      expect(parseMonsterStyle(['Slash'])).toBe('slash');
      expect(parseMonsterStyle(['Stab'])).toBe('stab');
      expect(parseMonsterStyle(['Magic'])).toBe('magic');
      expect(parseMonsterStyle(['Ranged'])).toBe('ranged');
    });

    test('hybrid styles', () => {
      expect(parseMonsterStyle(['Magical melee'])).toBe('magical melee');
      expect(parseMonsterStyle(['Magical ranged'])).toBe('magical ranged');
      expect(parseMonsterStyle(['Ranged melee'])).toBe('ranged melee');
      expect(parseMonsterStyle(['Ranged magic'])).toBe('ranged magic');
    });

    test('handles (100% prayer penetration) and trailing whitespace', () => {
      expect(parseMonsterStyle(['Magical ranged (100% prayer penetration)'])).toBe('magical ranged');
      expect(parseMonsterStyle(['Crush (100% prayer penetration)'])).toBe('crush');
      expect(parseMonsterStyle(['Slash   '])).toBe('slash');
      expect(parseMonsterStyle(['Slash \x7f\x7f'])).toBe('slash');
    });

    test('unsupported/null cases return null', () => {
      expect(parseMonsterStyle(['Crush', 'Ranged'])).toBeNull();
      expect(parseMonsterStyle(['Typeless'])).toBeNull();
      expect(parseMonsterStyle(['Melee'])).toBeNull();
      expect(parseMonsterStyle(['None'])).toBeNull();
      expect(parseMonsterStyle([])).toBeNull();
      expect(parseMonsterStyle(null)).toBeNull();
      expect(parseMonsterStyle(undefined)).toBeNull();
    });
  });
});
