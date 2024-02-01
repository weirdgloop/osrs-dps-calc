import { describe, expect, test } from '@jest/globals';
import { calculateNpcVsPlayer, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import { ACCURACY_PRECISION, DPS_PRECISION } from '@/lib/constants';
import { Prayer } from '@/enums/Prayer';

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

    test('protect melee', () => {
      const player = getTestPlayer(monster, { prayers: [Prayer.PROTECT_MELEE] });
      const result = calculateNpcVsPlayer(monster, player);

      expect(result.npcDps).toBeCloseTo(0.000, DPS_PRECISION);
    });
  });
});
