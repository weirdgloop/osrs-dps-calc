import { describe, expect, test } from '@jest/globals';
import Comparator, { CompareXAxis, CompareYAxis } from '@/lib/Comparator';
import { getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';

describe('Comparator', () => {
  test('Monster HP comparison stops at 1 HP', () => {
    const monster = getTestMonster(
      'Abyssal demon',
      'Standard',
      { skills: { hp: 3 } },
    );
    const player = getTestPlayer(monster);

    const comparator = new Comparator(
      [player],
      monster,
      CompareXAxis.MONSTER_HP,
      CompareYAxis.PLAYER_MAX_HIT,
    );

    const [entries] = comparator.getEntries();
    const hpValues = entries.map((entry) => entry.name);

    expect(hpValues).toEqual([3, 2, 1]);
  });
});
