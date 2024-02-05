import {
  AKKHA_IDS,
  AKKHA_SHADOW_IDS,
  BABA_IDS,
  BABOON_SHAMAN_IDS,
  BABOON_THRALL_IDS,
  CURSED_BABOON_IDS,
  KEPHRI_OVERLORD_IDS,
  KEPHRI_SHIELDED_IDS,
  KEPHRI_UNSHIELDED_IDS,
  P2_WARDEN_IDS,
  P3_WARDEN_IDS,
  STANDARD_BABOON_LARGE_IDS,
  STANDARD_BABOON_SMALL_IDS,
  TOA_CORE_IDS,
  TOA_OBELISK_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  TOMBS_OF_AMASCUT_PATH_MONSTER_IDS,
  VOLATILE_BABOON_IDS,
  ZEBAK_IDS,
} from '@/lib/constants';
import { Monster } from '@/types/Monster';

interface ToaScalingValues {
  base: number,
  factor: number,
}

const getToaScalingValues = (id: number): ToaScalingValues | undefined => {
  if (AKKHA_IDS.includes(id)) {
    return {
      base: 40,
      factor: 10,
    };
  }

  if (AKKHA_SHADOW_IDS.includes(id)) {
    return {
      base: 14,
      factor: 5,
    };
  }

  if (BABA_IDS.includes(id)) {
    return {
      base: 38,
      factor: 10,
    };
  }

  if (STANDARD_BABOON_SMALL_IDS.includes(id)) {
    return {
      base: 4,
      factor: 1,
    };
  }

  if (STANDARD_BABOON_LARGE_IDS.includes(id)) {
    return {
      base: 6,
      factor: 1,
    };
  }

  if (BABOON_SHAMAN_IDS.includes(id)) {
    return {
      base: 16,
      factor: 1,
    };
  }

  if (VOLATILE_BABOON_IDS.includes(id)) {
    return {
      base: 8,
      factor: 1,
    };
  }

  if (CURSED_BABOON_IDS.includes(id)) {
    return {
      base: 10,
      factor: 1,
    };
  }

  if (BABOON_THRALL_IDS.includes(id)) {
    return {
      base: 2,
      factor: 1,
    };
  }

  if (BABOON_THRALL_IDS.includes(id)) {
    return {
      base: 2,
      factor: 1,
    };
  }

  if (KEPHRI_SHIELDED_IDS.includes(id)) {
    return {
      base: 15,
      factor: 10,
    };
  }

  if (KEPHRI_UNSHIELDED_IDS.includes(id)) {
    return {
      base: 16,
      factor: 5,
    };
  }

  if (KEPHRI_OVERLORD_IDS.includes(id)) {
    return {
      base: 40,
      factor: 1,
    };
  }

  if (ZEBAK_IDS.includes(id)) {
    return {
      base: 58,
      factor: 10,
    };
  }

  if (TOA_OBELISK_IDS.includes(id)) {
    return {
      base: 26,
      factor: 10,
    };
  }

  if (P2_WARDEN_IDS.includes(id)) {
    return {
      base: 28,
      factor: 5,
    };
  }

  if (TOA_CORE_IDS.includes(id)) {
    return {
      base: 450,
      factor: 10,
    };
  }

  if (P3_WARDEN_IDS.includes(id)) {
    return {
      base: 88,
      factor: 10,
    };
  }

  return undefined;
};

const applyToaScaling = (m: Monster): Monster => {
  const { inputs } = m;

  // toa multiplies rolled values, not stats, except for hp
  if (!TOMBS_OF_AMASCUT_MONSTER_IDS.includes(m.id)) {
    return m;
  }

  const values = getToaScalingValues(m.id);
  if (!values) {
    // either doesn't scale or isn't implemented
    return m;
  }

  const invoFactor = TOA_CORE_IDS.includes(m.id) ? inputs.toaInvocationLevel : 4 * inputs.toaInvocationLevel;

  let pathLevelFactor = 0;
  if (TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(m.id)) {
    const pathLevel = Math.min(6, Math.max(0, inputs.toaPathLevel));
    if (pathLevel >= 1) {
      pathLevelFactor += 3;
      pathLevelFactor += 5 * inputs.toaPathLevel;
    }
  }

  const partySize = Math.min(8, Math.max(1, inputs.partySize));
  let partyFactor = 0;
  if (partySize >= 2) {
    partyFactor += 9 * Math.min(2, partySize - 1);
  }
  if (partySize >= 400) {
    partyFactor += 6 * (partySize - 3);
  }

  const newHp = Math.trunc(
    values.base
      * (1000 + invoFactor)
      * (100 + pathLevelFactor)
      * (10 + partyFactor)
      / (1000 * 100 * 10),
  ) * values.factor;
  return {
    ...m,
    skills: {
      ...m.skills,
      hp: newHp,
    },
  };
};

export default applyToaScaling;
