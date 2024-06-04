import { TOA_WARDEN_CORE_EJECTED_IDS, TOMBS_OF_AMASCUT_MONSTER_IDS, TOMBS_OF_AMASCUT_PATH_MONSTER_IDS } from '@/lib/constants';
import { Monster } from '@/types/Monster';

const applyToaScaling = (m: Monster): Monster => {
  const { inputs } = m;

  // toa multiplies rolled values, not stats, except for hp
  if (!TOMBS_OF_AMASCUT_MONSTER_IDS.includes(m.id)) {
    return m;
  }

  let newHp = m.skills.hp;
  if (TOA_WARDEN_CORE_EJECTED_IDS.includes(m.id)) {
    newHp = 4500;
  }

  const invoFactor = Math.trunc((TOA_WARDEN_CORE_EJECTED_IDS.includes(m.id) ? 1 : 4) * inputs.toaInvocationLevel / 10);
  newHp += Math.trunc(newHp * invoFactor / 100);

  const pathLevel = Math.min(6, Math.max(0, inputs.toaPathLevel));
  if (TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(m.id) && pathLevel >= 1) {
    const pathLevelFactor = 3 + 5 * inputs.toaPathLevel;
    newHp = Math.trunc(newHp * (100 + pathLevelFactor) / 100);
  }

  const partySize = Math.min(8, Math.max(1, inputs.partySize));
  if (partySize >= 2) {
    let partyFactor = 9 * (partySize === 3 ? 2 : 1);
    if (partySize >= 4) {
      partyFactor += 6 * (partySize - 3);
    }

    newHp = Math.trunc(newHp * (10 + partyFactor) / 10);
  }

  // some rounding, for once
  if (newHp > 100) {
    const roundTo = newHp > 300 ? 10 : 5;
    newHp = Math.trunc((newHp + Math.trunc(roundTo / 2)) / roundTo) * roundTo;
  }

  return {
    ...m,
    skills: {
      ...m.skills,
      hp: newHp,
    },
  };
};

export default applyToaScaling;
