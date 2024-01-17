import { expect, test } from '@jest/globals';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { getCombatStylesForCategory } from '@/utils';

test('getCombatStylesForCategory', () => {
  expect(getCombatStylesForCategory(EquipmentCategory.BLUDGEON)).toEqual([
    { name: 'Pound', type: 'crush', stance: 'Aggressive' },
    { name: 'Pummel', type: 'crush', stance: 'Aggressive' },
    { name: 'Smash', type: 'crush', stance: 'Aggressive' },
  ]);
});
