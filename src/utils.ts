import axios from 'axios';
import {PlayerSkills} from '@/types/Player';
import {ImportableData} from "@/types/State";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const SHORTLINK_API = 'https://dps.osrs.wiki/shortlink'
const API_PROXY = 'https://oldschool.runescape.wiki/cors'

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

export const isDevServer = () => {
  return process.env.NODE_ENV === 'development';
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

export const keys = <T extends {}>(o: T): (keyof T)[]  => {
  return Object.keys(o) as (keyof T)[];
}

export const lerp = (curr: number, srcStart: number, srcEnd: number, dstStart: number, dstEnd: number): number => {
  // does this need to be int-based?
  const srcRange = srcEnd - srcStart;
  const dstRange = dstEnd - dstStart;
  const currNorm = curr - srcStart;

  return Math.trunc((currNorm * dstRange / srcRange) + dstStart);
}
