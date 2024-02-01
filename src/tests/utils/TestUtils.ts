import getMonsters from '@/lib/Monsters';
import { Monster } from '@/types/Monster';
import { EquipmentPiece, Player } from '@/types/Player';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { DetailEntry, DetailKey } from '@/lib/CalcDetails';
import merge from 'lodash.mergewith';
import { generateEmptyPlayer } from '@/state';
import { PartialDeep } from 'type-fest';
import { calculateEquipmentBonusesFromGear } from '@/lib/Equipment';
import { Spell } from '@/types/Spell';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import eq from '../../../cdn/json/equipment.json';
import spellsRaw from '../../../cdn/json/spells.json';

const monsters = getMonsters();
const equipment = eq as EquipmentPiece[];
const spells = spellsRaw as Spell[];

function find<T>(arr: T[], pred: (_: T) => boolean, failMsg?: string): T {
  const opt = arr.find(pred);

  if (!opt) {
    throw new Error(failMsg);
  }

  return opt;
}

export function getTestPlayer(monster: Monster, overrides: PartialDeep<Player> = {}): Player {
  const player = merge(generateEmptyPlayer(), overrides);

  const calculated = calculateEquipmentBonusesFromGear(player, monster);
  player.bonuses = overrides.bonuses || calculated.bonuses;
  player.offensive = overrides.offensive || calculated.offensive;
  player.defensive = overrides.defensive || calculated.defensive;

  return player;
}

export function getTestMonster(name: string, version: string, overrides: PartialDeep<Monster> = {}): Monster {
  return merge(
    find(
      monsters,
      (m) => m.name === name && m.version === version,
      `Monster not found for name '${name}' and version '${version}'`,
    ),
    overrides,
  );
}

export function getTestMonsterById(id: number, overrides: PartialDeep<Monster> = {}): Monster {
  return merge(
    find(
      monsters,
      (m) => m.id === id,
      `Monster not found for id '${id}'`,
    ),
    overrides,
  );
}

export function findEquipment(name: string, version: string = ''): EquipmentPiece {
  return find(
    equipment,
    (e) => e.name === name && (version === '' || e.version === version),
    `Equipment piece not found for name '${name}' and version '${version}'`,
  );
}

export function findEquipmentById(id: number): EquipmentPiece {
  return find(
    equipment,
    (e) => e.id === id,
    `Equipment piece not found for id '${id}'`,
  );
}

export function findSpell(name: string): Spell {
  return find(spells, (s) => s.name === name);
}

export function calculatePlayerVsNpc(monster: Monster, player: Player) {
  const calc = new PlayerVsNPCCalc(player, monster, {
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

export function calculateNpcVsPlayer(monster: Monster, player: Player) {
  const calc = new NPCVsPlayerCalc(player, monster, {
    loadoutName: 'test',
  });
  return {
    npcMaxAttackRoll: calc.getNPCMaxAttackRoll(),
    npcMaxHit: calc.getNPCMaxHit(),
    npcDps: calc.getDps(),
    npcAccuracy: calc.getHitChance(),
    playerDefRoll: calc.getPlayerDefenceRoll(),
  };
}

export function findResult(details: DetailEntry[], key: DetailKey): unknown {
  return details.find((d) => d.label === key)?.value;
}
