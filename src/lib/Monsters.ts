import { Monster } from '@/types/Monster';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { isCombatStyleType } from '@/types/PlayerCombatStyle';
import monsters from '../../cdn/json/monsters.json';

export function getMonsters(): Omit<Monster, 'inputs'>[] {
  return monsters.map((m): Omit<Monster, 'inputs'> => {
    const maxHit = parseInt(m.max_hit.toString());
    const styleStr = m.style?.join(',').toLowerCase() || null;
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      image: m.image,
      size: m.size,
      speed: m.speed,
      style: isCombatStyleType(styleStr) ? styleStr : null,
      maxHit: Number.isNaN(maxHit) ? 0 : maxHit,
      skills: m.skills,
      offensive: m.offensive,
      defensive: m.defensive,
      attributes: m.attributes as MonsterAttribute[],
      weakness: <Monster['weakness']>m.weakness || null,
    };
  });
}

export const INITIAL_MONSTER_INPUTS: Monster['inputs'] = {
  isFromCoxCm: false,
  toaInvocationLevel: 0,
  toaPathLevel: 0,
  partyMaxCombatLevel: 126,
  partySumMiningLevel: 99,
  partyMaxHpLevel: 99,
  partySize: 1,
  monsterCurrentHp: 150,
  defenceReductions: {
    vulnerability: false,
    accursed: false,
    elderMaul: 0,
    dwh: 0,
    arclight: 0,
    emberlight: 0,
    bgs: 0,
    tonalztic: 0,
  },
};

export const CUSTOM_MONSTER_BASE: Monster = {
  id: -1,
  name: 'Custom monster',
  version: '',
  image: '',
  size: 1,
  speed: 4,
  style: 'stab',
  skills: {
    atk: 0,
    def: 0,
    hp: 150,
    magic: 0,
    ranged: 0,
    str: 0,
  },
  offensive: {
    atk: 0,
    magic: 0,
    magic_str: 0,
    ranged: 0,
    ranged_str: 0,
    str: 0,
  },
  defensive: {
    flat_armour: 0,
    stab: 0,
    slash: 0,
    crush: 0,
    magic: 0,
    light: 0,
    standard: 0,
    heavy: 0,
  },
  attributes: [],
  weakness: null,
  inputs: {
    ...INITIAL_MONSTER_INPUTS,
    monsterCurrentHp: 150,
  },
};
