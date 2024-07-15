import { describe, expect, test } from '@jest/globals';
import {
  calculatePlayerVsNpc, findEquipment, getTestMonster, getTestPlayer,
} from '@/tests/utils/TestUtils';
import { EquipmentPiece, PlayerSkills } from '@/types/Player';

const testScenario = (skill: keyof PlayerSkills, level: number, weapon: EquipmentPiece, resultKey: keyof ReturnType<typeof calculatePlayerVsNpc>, expectedValue: number) => {
  const m = getTestMonster();
  const p = getTestPlayer(m, {
    skills: {
      [skill]: level,
    },
    equipment: {
      weapon,
    },
  });

  const result = calculatePlayerVsNpc(m, p);
  expect(result[resultKey]).toBe(expectedValue);
};

describe('melee', () => {
  test('L1 accuracy', () => testScenario('atk', 1, findEquipment('Abyssal whip'), 'maxAttackRoll', 1752));
  test('L1 max hit', () => testScenario('str', 1, findEquipment('Abyssal whip'), 'maxHit', 2));
  test('L99 accuracy', () => testScenario('atk', 99, findEquipment('Abyssal whip'), 'maxAttackRoll', 16060));
  test('L99 max hit', () => testScenario('str', 99, findEquipment('Abyssal whip'), 'maxHit', 24));
});

describe('ranged', () => {
  test('L1 accuracy', () => testScenario('ranged', 1, findEquipment('Bow of faerdhinen'), 'maxAttackRoll', 2304));
  test('L1 max hit', () => testScenario('ranged', 1, findEquipment('Bow of faerdhinen'), 'maxHit', 3));
  test('L99 accuracy', () => testScenario('ranged', 99, findEquipment('Bow of faerdhinen'), 'maxAttackRoll', 21120));
  test('L99 max hit', () => testScenario('ranged', 99, findEquipment('Bow of faerdhinen'), 'maxHit', 29));
});

describe('magic', () => {
  test('L1 accuracy', () => testScenario('magic', 1, findEquipment('Trident of the seas'), 'maxAttackRoll', 948));
  test('L1 max hit', () => testScenario('magic', 1, findEquipment('Trident of the seas'), 'maxHit', 1));
  test('L99 accuracy', () => testScenario('magic', 99, findEquipment('Trident of the seas'), 'maxAttackRoll', 8690));
  test('L99 max hit', () => testScenario('magic', 99, findEquipment('Trident of the seas'), 'maxHit', 28));
});
