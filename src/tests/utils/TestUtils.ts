import { getMonsters, INITIAL_MONSTER_INPUTS } from '@/lib/Monsters';
import { Monster } from '@/types/Monster';
import { EquipmentPiece, Player } from '@/types/Player';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { DetailEntry, DetailKey } from '@/lib/CalcDetails';
import merge from 'lodash.mergewith';
import { generateEmptyPlayer } from '@/state';
import { PartialDeep } from 'type-fest';
import { calculateEquipmentBonusesFromGear } from '@/lib/Equipment';
import { Spell, spells } from '@/types/Spell';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { getCombatStylesForCategory } from '@/utils';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { CalcOpts } from '@/lib/BaseCalc';
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
      elderMaul: 0,
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

export function getTestPlayer(monster: Monster, overrides: PartialDeep<Player> = {}): Player {
  const player = merge(generateEmptyPlayer(), overrides);

  const calculated = calculateEquipmentBonusesFromGear(player, monster);
  player.bonuses = overrides.bonuses || calculated.bonuses;
  player.offensive = overrides.offensive || calculated.offensive;
  player.defensive = overrides.defensive || calculated.defensive;

  if (!overrides.style && overrides?.equipment?.weapon) {
    player.style = getCombatStylesForCategory(overrides.equipment.weapon.category || EquipmentCategory.NONE)[0];
  }

  return player;
}

export function getTestMonster(name: string = 'Abyssal demon', version: string = '', overrides: PartialDeep<Monster> = {}): Monster {
  const monster = merge(
    {},
    find(
      monsters,
      (m) => m.name === name && (!version || m.version === version),
      `Monster not found for name '${name}' and version '${version}'`,
    ),
    { inputs: INITIAL_MONSTER_INPUTS },
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
    { inputs: INITIAL_MONSTER_INPUTS },
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

export function calculatePlayerVsNpc(monster: Monster, player: Player, opts?: CalcOpts) {
  const calc = new PlayerVsNPCCalc(player, monster, {
    ...opts,
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
    dist: calc.getDistribution(),
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
