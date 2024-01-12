import {getMonsterOptions} from "@/lib/MonsterOptions";
import {Monster} from "@/types/Monster";
import {Player} from "@/types/Player";
import CombatCalc from "@/lib/CombatCalc";

let monsterOptions = getMonsterOptions();

export function getMonster(label: string, version: string): Monster {
    const monsterOption = monsterOptions.find((option) =>
        option.label === label && option.version === version
    );

    if (!monsterOption) {
        throw new Error(`Monster not found for label '${label}' and version '${version}'`);
    }

    return <Monster>monsterOption.monster;
};

export function calculate(player: Player, monster: Monster) {
    const calc = new CombatCalc(player, monster);
    let result = {
        npcDefRoll: calc.getNPCDefenceRoll(),
        maxHit: calc.getDistribution().getMax(),
        maxAttackRoll: calc.getMaxAttackRoll(),
        accuracy: calc.getHitChance(),
        dps: calc.getDps(),
    }
    return result;
}
