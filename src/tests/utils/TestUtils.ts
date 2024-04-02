import getMonsters from '@/lib/Monsters';
import { Monster } from '@/types/Monster';
import { EquipmentPiece, IPlayer } from '@/types/Player';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { DetailEntry, DetailKey } from '@/lib/CalcDetails';
import merge from 'lodash.mergewith';
import { PartialDeep } from 'type-fest';
import { calculateEquipmentBonusesFromGear } from '@/lib/Equipment';
import { Spell, spells } from '@/types/Spell';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import Player from '@/lib/Player';
import { toJS } from 'mobx';
import eq from '../../../cdn/json/equipment.json';

const monsters = getMonsters().map((m) => ({
  ...m,
  inputs: {
    isFromCoxCm: false,
    toaInvocationLevel: 0,
    toaPathLevel: 0,
    partyMaxCombatLevel: 126,
    partyAvgMiningLevel: 99,
    partyMaxHpLevel: 99,
    partySize: 1,
    monsterCurrentHp: 150,
    defenceReductions: {
      vulnerability: false,
      accursed: false,
      dwh: 0,
      arclight: 0,
      bgs: 0,
    },
  },
}));
const equipment = eq as EquipmentPiece[];

function find<T>(arr: T[], pred: (_: T) => boolean, failMsg?: string): T {
  const opt = arr.find(pred);

  if (!opt) {
    throw new Error(failMsg);
  }

  return opt;
}

export function getTestPlayer(monster: Monster, overrides: PartialDeep<IPlayer> = {}): IPlayer {
  const player = new Player(overrides);

  const calculated = calculateEquipmentBonusesFromGear(player, monster);
  player.update({
    bonuses: overrides.bonuses || calculated.bonuses,
    offensive: overrides.offensive || calculated.offensive,
    defensive: overrides.defensive || calculated.defensive,
  });

  return { ...toJS(player), boosts: player.boosts };
}

const DEFAULT_MONSTER_INPUTS: Monster['inputs'] = {
  monsterCurrentHp: 0, // handled dynamically in getTestMonster
  isFromCoxCm: false,
  toaInvocationLevel: 0,
  toaPathLevel: 0,
  partyMaxCombatLevel: 126,
  partyAvgMiningLevel: 99,
  partyMaxHpLevel: 99,
  partySize: 1,
  defenceReductions: {
    vulnerability: false,
    accursed: false,
    dwh: 0,
    arclight: 0,
    bgs: 0,
  },
};

export function getTestMonster(name: string, version: string, overrides: PartialDeep<Monster> = {}): Monster {
  const monster = merge(
    find(
      monsters,
      (m) => m.name === name && m.version === version,
      `Monster not found for name '${name}' and version '${version}'`,
    ),
    { inputs: DEFAULT_MONSTER_INPUTS },
    overrides,
  );

  monster.monsterCurrentHp = monster.monsterCurrentHp || monster.skills.hp;
  return monster;
}

export function getTestMonsterById(id: number, overrides: PartialDeep<Monster> = {}): Monster {
  const monster = merge(
    find(
      monsters,
      (m) => m.id === id,
      `Monster not found for id '${id}'`,
    ),
    { inputs: DEFAULT_MONSTER_INPUTS },
    overrides,
  );

  monster.monsterCurrentHp = monster.monsterCurrentHp || monster.skills.hp;
  return monster;
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

export function calculatePlayerVsNpc(monster: Monster, player: IPlayer) {
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

export function calculateNpcVsPlayer(monster: Monster, player: IPlayer) {
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
