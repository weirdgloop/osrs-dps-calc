import axios from 'axios';
import {PlayerSkills} from '@/types/Player';

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const API_PROXY = 'https://oldschool.runescape.wiki/cors/'

/**
 * Fetch a player's skills (using the Hiscores API)
 * @param username
 */
export const fetchPlayerSkills = async (username: string) => {
  const res = await axios.get<string>(`${API_PROXY}/m=hiscore_oldschool/index_lite.ws?player=${username.replaceAll(' ', '_')}`);
  let skills: PlayerSkills;

  // The Hiscores API returns in a CSV format, rather than JSON, so we need to do some manual parsing here
  let rawData = res.data.split(' ');
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