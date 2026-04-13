import { expect, test } from '@jest/globals';
import { calculatePlayerVsNpc, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import { ACCURACY_PRECISION, DPS_PRECISION } from '@/lib/constants';

test('Empty player against abyssal demon', () => {
  const monster = getTestMonster('Abyssal demon', 'Standard');
  const player = getTestPlayer(monster);
  const result = calculatePlayerVsNpc(monster, player);

  expect(result.maxHit).toBe(11);
  expect(result.dps).toBeCloseTo(0.677, DPS_PRECISION);
  expect(result.maxAttackRoll).toBe(7040);
  expect(result.npcDefRoll).toBe(12096);
  expect(result.accuracy * 100).toBeCloseTo(29.10, ACCURACY_PRECISION);
});

test('Executioner keeps base DPS while improving TTK at threshold HP', () => {
  const monster = getTestMonster('Abyssal demon', 'Standard', {
    inputs: {
      monsterCurrentHp: 30,
    },
  });
  const basePlayer = getTestPlayer(monster);
  const executionerPlayer = getTestPlayer(monster, {
    leagues: {
      six: {
        executionerEnabled: true,
      },
    },
  });

  const baseResult = calculatePlayerVsNpc(monster, basePlayer);
  const executionerResult = calculatePlayerVsNpc(monster, executionerPlayer);

  expect(executionerResult.dps).toBeCloseTo(baseResult.dps, DPS_PRECISION);
  expect(executionerResult.ttk).toBeLessThan(baseResult.ttk);
  expect(executionerResult.executionerDps).toBeDefined();
  expect(executionerResult.executionerDps).toBeGreaterThan(executionerResult.dps);
});
