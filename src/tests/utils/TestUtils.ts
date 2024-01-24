import getMonsters from '@/lib/Monsters';
import { Monster } from '@/types/Monster';
import { EquipmentPiece, Player } from '@/types/Player';
import CombatCalc from '@/lib/CombatCalc';
import { DetailEntry, DetailKey } from '@/lib/CalcDetails';
import merge from 'lodash.mergewith';
import { generateEmptyPlayer } from '@/state';
import { PartialDeep } from 'type-fest';
import { calculateEquipmentBonusesFromGear } from '@/lib/Equipment';
import eq from '../../../cdn/json/equipment.json';

const monsters = getMonsters();
const equipment = eq as EquipmentPiece[];

export function getTestPlayer(monster: Monster, overrides: PartialDeep<Player> = {}): Player {
  const player = merge(generateEmptyPlayer(), overrides);

  const calculated = calculateEquipmentBonusesFromGear(player, monster);
  player.bonuses = overrides.bonuses || calculated.bonuses;
  player.offensive = overrides.offensive || calculated.offensive;
  player.defensive = overrides.defensive || calculated.defensive;

  return player;
}

export function getTestMonster(name: string, version: string, overrides: PartialDeep<Monster> = {}): Monster {
  const monsterOption = monsters.find((option) => option.name === name && option.version === version);

  if (!monsterOption) {
    throw new Error(`Monster not found for name '${name}' and version '${version}'`);
  }

  return merge(monsterOption, overrides);
}

export function findEquipment(name: string, version: string = ''): EquipmentPiece {
  const opt = equipment.find((e) => e.name === name && (version === '' || e.version === version));

  if (!opt) {
    throw new Error(`Equipment piece not found for name '${name}' and version '${version}'`);
  }

  return opt;
}

export function calculate(player: Player, monster: Monster) {
  const calc = new CombatCalc(player, monster, {
    loadoutName: 'test',
    detailedOutput: true,
  });
  return {
    npcDefRoll: calc.getNPCDefenceRoll(),
    maxHit: calc.getDistribution().getMax(),
    maxAttackRoll: calc.getMaxAttackRoll(),
    accuracy: calc.getHitChance(),
    dps: calc.getDps(),
    details: calc.details,
  };
}

export function findResult(details: DetailEntry[], key: DetailKey): string | undefined {
  return details.find((d) => d.label === key)?.value;
}
