import {Monster} from "@/types/Monster";
import {
  ABYSSAL_PORTAL_IDS,
  GLOWING_CRYSTAL_IDS,
  GUARDIAN_IDS,
  OLM_HEAD_IDS,
  OLM_IDS,
  SCAVENGER_BEAST_IDS,
  TEKTON_IDS,
  TOB_EM_MONSTER_IDS,
  TOB_MONSTER_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  TOMBS_OF_AMASCUT_PATH_MONSTER_IDS
} from "@/constants";

export const scaledMonster: (m: Monster) => Monster = m => {
  const mId = m.id || 0;
  
  // toa multiplies rolled values, not stats, except for hp
  if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(mId)) {
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
    if (TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(mId)) {
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
  if (TOB_MONSTER_IDS.includes(mId)) {
    const partySize = Math.min(5, Math.max(3, m.partySize));
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: Math.trunc(m.skills.hp * (partySize + 3) / 8)
      }
    }
  }
  
  if (TOB_EM_MONSTER_IDS.includes(mId)) {
    const partySize = Math.min(5, Math.max(1, m.partySize));
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: Math.trunc(m.skills.hp * partySize / 5)
      }
    }
  }
  
  if (m.attributes.includes('xerician')) {
    const cmb = Math.min(126, Math.max(3, m.partyMaxCombatLevel));
    const hp = Math.min(99, Math.max(1, m.partyMaxHpLevel));
    const min = Math.min(99, Math.max(1, m.partyAvgMiningLevel));
    const ps = Math.min(100, Math.max(1, m.partySize));
    const cm = m.isFromCoxCm;

    const sqrt = (x: number) => Math.trunc(Math.sqrt(x));
    
    // olm does everything differently
    if (OLM_IDS.includes(mId)) {
      const olmHp = () => (OLM_HEAD_IDS.includes(mId) ? 400 : 300) * (ps - Math.trunc(ps / 8) * 3 + 1);
      const olmDefence = (base: number) => Math.trunc(base * (sqrt(ps - 1) + Math.trunc((ps - 1) * 7 / 10) + 100) / 100 * (cm ? 3 : 2) / 2);
      const olmOffence = (base: number) => Math.trunc(base * (sqrt(ps - 1) * 7 + (ps - 1) + 100) / 100 * (cm ? 3 : 2) / 2);
      return {
        ...m,
        skills: {
          ...m.skills,
          hp: olmHp(),
          atk: olmOffence(m.skills.atk),
          str: olmOffence(m.skills.str),
          ranged: olmOffence(m.skills.ranged),
          magic: olmOffence(m.skills.magic),
          def: olmDefence(m.skills.def),
        },
      };
    }
    
    const scaleHp = (base: number) => {
      if (SCAVENGER_BEAST_IDS.includes(mId)) { // no scaling
        return base;
      }
      const baseHp = GUARDIAN_IDS.includes(mId) ? 151 + min : m.skills.hp;
      const c = cm && !GLOWING_CRYSTAL_IDS.includes(mId);
      return Math.trunc(Math.trunc(baseHp * cmb / 126) * (Math.trunc(ps / 2) + 1) * (c ? 3 : 2) / 2);
    };
    const scaleDefence = (base: number) => {
      const f = TEKTON_IDS.includes(mId) ? 5 : 2;
      const c = cm && !GLOWING_CRYSTAL_IDS.includes(mId);
      return Math.trunc(Math.trunc(Math.trunc(base * (Math.trunc(hp * 4 / 9) + 55) / 99) * (sqrt(ps - 1) + Math.trunc((ps - 1) * 7 / 10) + 100) / 100) * (c ? f + 1 : f) / f);
    };
    const scaleOffence = (base: number, f: number = 2) => {
      if (ABYSSAL_PORTAL_IDS.includes(mId)) {
        return scaleDefence(base);
      }
      return Math.trunc(Math.trunc(Math.trunc(base * (Math.trunc(hp * 4 / 9) + 55) / 99) * (sqrt(ps - 1) * 7 + (ps - 1) + 100) / 100) * (cm ? f + 1 : f) / f);
    }
    const scaleMagic = (base: number) => {
      const f = TEKTON_IDS.includes(mId) ? 5 : 2;
      return scaleOffence(base, f);
    }
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: scaleHp(m.skills.hp),
        atk: scaleOffence(m.skills.atk),
        str: scaleOffence(m.skills.str),
        ranged: scaleOffence(m.skills.ranged),
        magic: scaleMagic(m.skills.magic),
        def: scaleDefence(m.skills.def),
      },
    };
  }
  
  return m;
}