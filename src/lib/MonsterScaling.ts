import {Monster} from "@/types/Monster";
import {
  ABYSSAL_PORTAL_IDS,
  AKKHA_IDS,
  AKKHA_SHADOW_IDS,
  BABA_IDS,
  BABOON_SHAMAN_IDS,
  BABOON_THRALL_IDS,
  CURSED_BABOON_IDS,
  GLOWING_CRYSTAL_IDS,
  GUARDIAN_IDS,
  KEPHRI_OVERLORD_IDS,
  KEPHRI_SHIELDED_IDS,
  KEPHRI_UNSHIELDED_IDS,
  OLM_HEAD_IDS,
  OLM_IDS,
  P2_WARDEN_IDS,
  P3_WARDEN_IDS,
  SCAVENGER_BEAST_IDS,
  STANDARD_BABOON_LARGE_IDS,
  STANDARD_BABOON_SMALL_IDS,
  TEKTON_IDS,
  TOA_CORE_IDS,
  TOA_OBELISK_IDS,
  TOB_EM_MONSTER_IDS,
  TOB_MONSTER_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  TOMBS_OF_AMASCUT_PATH_MONSTER_IDS,
  VOLATILE_BABOON_IDS,
  ZEBAK_IDS
} from "@/constants";
import {MonsterAttribute} from "@/enums/MonsterAttribute";
import {lerp} from "@/utils";

export const scaledMonster: (m: Monster) => Monster = m => {
  const mId = m.id;

  // vard's strength and defence scale linearly throughout the fight based on hp
  if (m.name === 'Vardorvis') {
    let vardRanges = {
      maxHp: 700,
      str: [270, 360],
      def: [215, 145],
    };
    if (m.version === 'Quest') {
      vardRanges = {
        maxHp: 500,
        str: [210, 280],
        def: [180, 130],
      };
    } else if (m.version === 'Awakened') {
      vardRanges = {
        maxHp: 1400,
        str: [391, 522],
        def: [268, 181],
      };
    }
    
    const currHp = isFinite(m.monsterCurrentHp) ? m.monsterCurrentHp : vardRanges.maxHp;
    return {
      ...m,
      skills: {
        ...m.skills,
        str: lerp(currHp, vardRanges.maxHp, 0, vardRanges.str[0], vardRanges.str[1]),
        def: lerp(currHp, vardRanges.maxHp, 0, vardRanges.def[0], vardRanges.def[1]),
      }
    }
  }

  // toa multiplies rolled values, not stats, except for hp
  if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(mId)) {
    const values = getToaScalingValues(mId);
    if (!values) {
      // either doesn't scale or isn't implemented
      return m;
    }

    const invoFactor = TOA_CORE_IDS.includes(mId) ? m.toaInvocationLevel : 4 * m.toaInvocationLevel;

    let pathLevelFactor = 0;
    if (TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(mId)) {
      const pathLevel = Math.min(6, Math.max(0, m.toaPathLevel));
      if (pathLevel >= 1) {
        pathLevelFactor += 30;
        pathLevelFactor += 50 * m.toaPathLevel;
      }
    }

    const partySize = Math.min(8, Math.max(1, m.partySize));
    let partyFactor = 0;
    if (partySize >= 2) {
      partyFactor += 9 * Math.min(2, partySize - 1);
    }
    if (partySize >= 400) {
      partyFactor += 6 * (partySize - 3);
    }

    const newHp = Math.trunc(
      values.base *
      (1000 + invoFactor) *
      (100 + pathLevelFactor) *
      (10 + partyFactor) /
      (1000 * 100 * 10)
    ) * values.factor;
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: newHp,
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

  if (m.attributes.includes(MonsterAttribute.XERICIAN)) {
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

interface ToaScalingValues {
  base: number,
  factor: number,
}

const getToaScalingValues = (id: number): ToaScalingValues | undefined => {
  if (AKKHA_IDS.includes(id)) {
    return {
      base: 40,
      factor: 10,
    }
  }

  if (AKKHA_SHADOW_IDS.includes(id)) {
    return {
      base: 14,
      factor: 5,
    }
  }

  if (BABA_IDS.includes(id)) {
    return {
      base: 38,
      factor: 10,
    }
  }

  if (STANDARD_BABOON_SMALL_IDS.includes(id)) {
    return {
      base: 4,
      factor: 1,
    }
  }

  if (STANDARD_BABOON_LARGE_IDS.includes(id)) {
    return {
      base: 6,
      factor: 1,
    }
  }

  if (BABOON_SHAMAN_IDS.includes(id)) {
    return {
      base: 16,
      factor: 1,
    }
  }

  if (VOLATILE_BABOON_IDS.includes(id)) {
    return {
      base: 8,
      factor: 1,
    }
  }

  if (CURSED_BABOON_IDS.includes(id)) {
    return {
      base: 10,
      factor: 1,
    }
  }

  if (BABOON_THRALL_IDS.includes(id)) {
    return {
      base: 2,
      factor: 1,
    }
  }

  if (BABOON_THRALL_IDS.includes(id)) {
    return {
      base: 2,
      factor: 1,
    }
  }

  if (KEPHRI_SHIELDED_IDS.includes(id)) {
    return {
      base: 15,
      factor: 10,
    }
  }

  if (KEPHRI_UNSHIELDED_IDS.includes(id)) {
    return {
      base: 16,
      factor: 5,
    }
  }

  if (KEPHRI_OVERLORD_IDS.includes(id)) {
    return {
      base: 40,
      factor: 1,
    }
  }

  if (ZEBAK_IDS.includes(id)) {
    return {
      base: 58,
      factor: 10,
    }
  }

  if (TOA_OBELISK_IDS.includes(id)) {
    return {
      base: 26,
      factor: 10,
    }
  }

  if (P2_WARDEN_IDS.includes(id)) {
    return {
      base: 28,
      factor: 5,
    }
  }

  if (TOA_CORE_IDS.includes(id)) {
    return {
      base: 450,
      factor: 10,
    }
  }

  if (P3_WARDEN_IDS.includes(id)) {
    return {
      base: 88,
      factor: 10,
    }
  }

  return undefined;
}
