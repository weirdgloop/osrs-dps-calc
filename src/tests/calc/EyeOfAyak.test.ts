import { expect, test } from '@jest/globals';
import { findEquipment, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { Prayer } from '@/enums/Prayer';

test('Eye of Ayak applies its special attack multiplier after magic damage bonuses', () => {
  const monster = getTestMonster();
  const player = getTestPlayer(monster, {
    equipment: {
      weapon: findEquipment('Eye of Ayak', 'Charged'),
      neck: findEquipment('Occult necklace'),
    },
    prayers: [Prayer.AUGURY],
    skills: { magic: 99 },
  });

  const calc = new PlayerVsNPCCalc(player, monster);
  expect(calc.getMax()).toBe(29);
  expect(calc.getSpecCalc()?.getMax()).toBe(37);
});
