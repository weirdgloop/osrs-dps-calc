import { expect, test } from '@jest/globals';
import { getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import Comparator, { CompareXAxis, CompareYAxis } from '@/lib/Comparator';

test('Loadout comparison graph reflects strength boosts', () => {
  const monster = getTestMonster('Abyssal demon', 'Standard');

  const withoutBoost = getTestPlayer(monster, { name: 'no boost', skills: { str: 70 } });
  const withBoost = getTestPlayer(monster, { name: 'super str', skills: { str: 70 }, boosts: { str: 19 } });

  const comparator = new Comparator(
    [withoutBoost, withBoost],
    monster,
    CompareXAxis.PLAYER_STRENGTH_LEVEL,
    CompareYAxis.PLAYER_DPS,
  );

  const [entries] = comparator.getEntries();
  
  // Find the entry for strength level 70
  const atLevel70 = entries.find((e) => e.name === 70);
  expect(atLevel70).toBeDefined();

  const dpsWithout = parseFloat(atLevel70!['no boost'] as string);
  const dpsWith = parseFloat(atLevel70!['super str'] as string);

  // The boosted loadout should have higher DPS at the same base strength level
  expect(dpsWith).toBeGreaterThan(dpsWithout);
});
