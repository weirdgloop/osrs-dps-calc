import { expect, test } from '@jest/globals';
import {
  calculate, findResult, getTestMonster, getTestPlayer,
} from '@/tests/utils/TestUtils';
import { DetailKey } from '@/lib/CalcDetails';

test('Abyssal demon', () => {
  const monster = getTestMonster('Abyssal demon', 'Standard');
  const player = getTestPlayer(monster);
  const { npcDefRoll, details } = calculate(monster, player);

  expect(npcDefRoll).toBe(12096);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_LEVEL)).toBe(135);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_EFFECTIVE_LEVEL)).toBe(144);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_BASE)).toBe(12096);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_FINAL)).toBe(12096);
  expect(findResult(details, DetailKey.DEFENCE_ROLL_TOA)).toBeUndefined();
});
