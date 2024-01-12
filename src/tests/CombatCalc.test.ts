import {expect, test} from "@jest/globals";
import {generateEmptyPlayer} from "@/state";
import {calculate, getMonster} from "@/tests/utils/TestUtils";

test('Empty player against Abyssal demon', () => {
    let player = generateEmptyPlayer();
    let monster = getMonster("Abyssal demon", "Standard");
    let result = calculate(player, monster);

    expect(result.maxHit).toBe(11);
    expect(result.dps).toBe(0.6668319969138353);
    expect(result.maxAttackRoll).toBe(7040);
    expect(result.npcDefRoll).toBe(12096);
    expect(result.accuracy).toBe(0.29098123501694634);
});
