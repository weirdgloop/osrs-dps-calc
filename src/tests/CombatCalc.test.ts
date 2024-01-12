import {expect, test} from "@jest/globals";
import {generateEmptyPlayer} from "@/state";
import {calculate, getMonster} from "@/tests/utils/TestUtils";
import {ACCURACY_PRECISION, DPS_PRECISION} from "@/constants";

test('Empty player against Abyssal demon', () => {
    let player = generateEmptyPlayer();
    let monster = getMonster("Abyssal demon", "Standard");
    let result = calculate(player, monster);

    expect(result.maxHit).toBe(11);
    expect(result.dps).toBeCloseTo(0.667, DPS_PRECISION);
    expect(result.maxAttackRoll).toBe(7040);
    expect(result.npcDefRoll).toBe(12096);
    expect(result.accuracy * 100).toBeCloseTo(29.10, ACCURACY_PRECISION);
});
