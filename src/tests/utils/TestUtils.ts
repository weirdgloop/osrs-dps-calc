import getMonsters from '@/lib/Monsters';
import { Monster } from '@/types/Monster';
import { Player } from '@/types/Player';
import CombatCalc from '@/lib/CombatCalc';

const monsters = getMonsters();

export function getMonster(name: string, version: string): Monster {
  const monsterOption = monsters.find((option) => option.name === name && option.version === version);

  if (!monsterOption) {
    throw new Error(`Monster not found for name '${name}' and version '${version}'`);
  }

  return <Monster>monsterOption;
}

export function calculate(player: Player, monster: Monster) {
  const calc = new CombatCalc(player, monster);
  const result = {
    npcDefRoll: calc.getNPCDefenceRoll(),
    maxHit: calc.getDistribution().getMax(),
    maxAttackRoll: calc.getMaxAttackRoll(),
    accuracy: calc.getHitChance(),
    dps: calc.getDps(),
  };
  return result;
}
