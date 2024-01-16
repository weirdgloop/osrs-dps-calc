import getMonsters from '@/lib/Monsters';
import { Monster } from '@/types/Monster';
import { Player } from '@/types/Player';
import CombatCalc from '@/lib/CombatCalc';
import { GlobalState } from '@/state';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';
import { Prayer } from '@/enums/Prayer';
import Potion from '@/enums/Potion';

const monsters = getMonsters();

export function getMonster(name: string, version: string): Monster {
  const monsterOption = monsters.find((option) => option.name === name && option.version === version);

  if (!monsterOption) {
    throw new Error(`Monster not found for name '${name}' and version '${version}'`);
  }

  return <Monster>monsterOption;
}

export function calculate(
  player: PartialObjectDeep<Player, {}>,
  monster: Monster,
  togglePrayers: Prayer[] = [],
  togglePotions: Potion[] = [],
) {
  const state = new GlobalState();
  state.updatePlayer(player);

  togglePrayers.forEach((prayer) => state.togglePlayerPrayer(prayer));
  togglePotions.forEach((potion) => state.togglePlayerPotion(potion));

  state.recalculateEquipmentBonusesFromGear();

  const calc = new CombatCalc(state.player, monster);
  const result = {
    npcDefRoll: calc.getNPCDefenceRoll(),
    maxHit: calc.getDistribution().getMax(),
    maxAttackRoll: calc.getMaxAttackRoll(),
    accuracy: calc.getHitChance(),
    dps: calc.getDps(),
  };
  return result;
}
