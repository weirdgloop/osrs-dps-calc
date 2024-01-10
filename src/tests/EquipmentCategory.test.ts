import {expect, test} from "@jest/globals";
import {EquipmentCategory, getCombatStylesForCategory} from "@/enums/EquipmentCategory";

test('getCombatStylesForCategory', () => {
  expect(getCombatStylesForCategory(EquipmentCategory.BLUDGEON)).toEqual([
    {name: 'Pound', type: 'crush', stance: 'Aggressive'},
    {name: 'Pummel', type: 'crush', stance: 'Aggressive'},
    {name: 'Smash', type: 'crush', stance: 'Aggressive'}
  ])
})
