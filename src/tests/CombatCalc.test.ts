import { expect, test } from '@jest/globals';
import { generateEmptyPlayer } from '@/state';
import { calculate, getMonster } from '@/tests/utils/TestUtils';
import { ACCURACY_PRECISION, DPS_PRECISION } from '@/constants';
import { createVoidMeleeEquipmentSet } from '@/tests/data/testData';
import { Prayer } from '@/enums/Prayer';
import Potion from '@/enums/Potion';

test('Empty player against Abyssal demon', () => {
  const player = generateEmptyPlayer();
  const monster = getMonster('Abyssal demon', 'Standard');
  const result = calculate(player, monster);

  expect(result.maxHit).toBe(11);
  expect(result.dps).toBeCloseTo(0.667, DPS_PRECISION);
  expect(result.maxAttackRoll).toBe(7040);
  expect(result.npcDefRoll).toBe(12096);
  expect(result.accuracy * 100).toBeCloseTo(29.10, ACCURACY_PRECISION);
});

test('Void melee against Abyssal demon', () => {
  const player = createVoidMeleeEquipmentSet();
  const monster = getMonster('Abyssal demon', 'Standard');
  const result = calculate(player, monster, [Prayer.PIETY], [Potion.SUPER_COMBAT]);

  expect(result.maxHit).toBe(51);
  expect(result.dps).toBeCloseTo(8.739, DPS_PRECISION);
  expect(result.maxAttackRoll).toBe(34068);
  expect(result.npcDefRoll).toBe(12096);
  expect(result.accuracy * 100).toBeCloseTo(82.24, ACCURACY_PRECISION);
});
