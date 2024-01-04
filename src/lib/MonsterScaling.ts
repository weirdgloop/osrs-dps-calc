import {Monster} from "@/types/Monster";
import {
  TOB_EM_MONSTER_IDS,
  TOB_MONSTER_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  TOMBS_OF_AMASCUT_PATH_MONSTER_IDS
} from "@/constants";

export const scaledMonster: (m: Monster) => Monster = m => {
  // toa multiplies rolled values, not stats, except for hp
  if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(m.id || 0)) {
    const invoHp = Math.trunc(m.skills.hp * (250 + m.toaInvocationLevel) / 250);
    
    const partySize = Math.min(8, Math.max(1, m.partySize));
    let partyFactor = 10;
    if (partySize >= 2) {
      partyFactor += 9 * (Math.max(2, partySize) - 1);
    }
    if (partySize >= 4) {
      partyFactor += 6 * (partySize - 3);
    }
    const partyHp = Math.trunc(invoHp * partyFactor / 10);
    
    let pathHp = partyHp;
    if (TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(m.id || 0)) {
      const pathLevel = Math.min(6, Math.max(0, m.toaPathLevel));
      let pathLevelFactor = 10;
      if (pathLevel >= 1) {
        pathLevelFactor += 8;
      }
      if (pathLevel >= 2) {
        pathLevelFactor += 5 * (m.toaPathLevel - 1);
      }
      pathHp = Math.trunc(partyHp * pathLevelFactor / 10);
    }
    
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: pathHp,
      }
    }
  }
  
  // tob only scales hp and nothing else
  if (TOB_MONSTER_IDS.includes(m.id || 0)) {
    const partySize = Math.min(5, Math.max(3, m.partySize));
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: Math.trunc(m.skills.hp * (partySize + 3) / 8)
      }
    }
  }
  
  if (TOB_EM_MONSTER_IDS.includes(m.id || 0)) {
    const partySize = Math.min(5, Math.max(1, m.partySize));
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: Math.trunc(m.skills.hp * partySize / 5)
      }
    }
  }
  
  // todo cox
  
  return m;
}