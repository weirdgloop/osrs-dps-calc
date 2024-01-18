import { expect, test } from '@jest/globals';
import { generateEmptyPlayer } from '@/state';
import { calculate, findResult, getMonster } from '@/tests/utils/TestUtils';
import { DetailKey } from '@/lib/CalcDetails';

test('Abyssal demon', () => {
  const player = generateEmptyPlayer();
  const monster = getMonster('Abyssal demon', 'Standard');
  const { npcDefRoll, details } = calculate(player, monster);

  expect(npcDefRoll).toBe(12096);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_LEVEL)).toBe(135);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_EFFECTIVE_LEVEL)).toBe(144);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_BASE)).toBe(12096);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_FINAL)).toBe(12096);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_TOA)).toBeUndefined();
});
