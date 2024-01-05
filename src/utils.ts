import axios from 'axios';
import {EquipmentPiece, Player, PlayerSkills} from '@/types/Player';
import equipment from '../cdn/json/equipment.json';
import {ImportableData} from "@/types/State";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const SHORTLINK_API = 'https://dps.osrs.wiki/shortlink'
const API_PROXY = 'https://oldschool.runescape.wiki/cors'

/**
 * Get an equipment piece by key from the equipment JSON
 * @param key
 */
export const getEquipment = (key: string) => {
  return equipment[key as keyof typeof equipment] as EquipmentPiece;
}

/**
 * Get all equipment data for a loadout
 */
export const getEquipmentForLoadout = (loadout: Player) => {
  const data: {[k in keyof typeof loadout.equipment]: EquipmentPiece | null} = {
    head: loadout.equipment.head ? getEquipment(loadout.equipment.head) : null,
    body: loadout.equipment.body ? getEquipment(loadout.equipment.body) : null,
    neck: loadout.equipment.neck ? getEquipment(loadout.equipment.neck) : null,
    cape: loadout.equipment.cape ? getEquipment(loadout.equipment.cape) : null,
    ammo: loadout.equipment.ammo ? getEquipment(loadout.equipment.ammo) : null,
    hands: loadout.equipment.hands ? getEquipment(loadout.equipment.hands) : null,
    feet: loadout.equipment.feet ? getEquipment(loadout.equipment.feet) : null,
    legs: loadout.equipment.legs ? getEquipment(loadout.equipment.legs) : null,
    ring: loadout.equipment.ring ? getEquipment(loadout.equipment.ring) : null,
    weapon: loadout.equipment.weapon ? getEquipment(loadout.equipment.weapon) : null,
    shield: loadout.equipment.shield ? getEquipment(loadout.equipment.shield) : null,
  }
  return data;
}

/**
 * Fetch a player's skills (using the Hiscores API)
 * @param username
 */
export const fetchPlayerSkills = async (username: string) => {
  const res = await axios.get<string>(`${API_PROXY}/m=hiscore_oldschool/index_lite.ws?player=${username.replaceAll(' ', '_')}`);
  let skills: PlayerSkills;

  // The Hiscores API returns in a CSV format, rather than JSON, so we need to do some manual parsing here
  let rawData = res.data.split('\n');
  let skillData = rawData.map((v) => {
    let d = v.split(',');
    return {rank: parseInt(d[0]), level: parseInt(d[1]), xp: parseInt(d[2])};
  })

  skills = {
    atk: skillData[1].level,
    def: skillData[2].level,
    str: skillData[3].level,
    hp: skillData[4].level,
    ranged: skillData[5].level,
    prayer: skillData[6].level,
    magic: skillData[7].level
  }

  return skills;
}

export const fetchShortlinkData = async (linkId: string): Promise<ImportableData> => {
  const res = await axios.get<{data: ImportableData}>(`${SHORTLINK_API}?id=${linkId}`);
  return res.data.data;
}

export const generateShortlink = async (data: ImportableData): Promise<string> => {
  const res = await axios.post(SHORTLINK_API, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res.data.data;
}

/**
 * Calculates a player's combat level using their skills
 * @param s
 */
export const calculateCombatLevel = (s: PlayerSkills) => {
  const baseLevel = 0.25 * (s.def + s.hp + Math.floor(s.prayer / 2));
  const meleeCbLevel = 0.325 * (s.atk + s.str);
  const magicCbLevel = 0.325 * (Math.floor(s.magic / 2) + s.magic);
  const rangedCbLevel = 0.325 * (Math.floor(s.ranged / 2) + s.ranged);
  const cbType = Math.max(meleeCbLevel, Math.max(magicCbLevel, rangedCbLevel));
  const cbLevelDouble = baseLevel + cbType;

  // Return the combat level
  return Math.floor(cbLevelDouble);
}

export const getWikiImage = (filename: string) => {
  return `https://oldschool.runescape.wiki/images/${filename.replaceAll(' ', '_')}?11111`
}

export const getCdnImage = (filename: string) => {
  return `https://dps.osrs.wiki/cdn/${filename}`
}

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '\u2026'
}

export const WORKER_JSON_REPLACER: (key: string, value: any) => any = (k, v) => {
  if (v instanceof Map) {
    return {
      _dataType: 'Map',
      m: Array.from(v),
    };
  } else {
    return v;
  }
}

export const WORKER_JSON_REVIVER: (key: string, value: any) => any = (k, v) => {
  if (typeof v === 'object' && v?._dataType === 'Map') {
    return new Map(v.m);
  } else {
    return v;
  }
}
