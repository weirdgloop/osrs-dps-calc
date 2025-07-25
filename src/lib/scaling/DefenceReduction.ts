import { Monster } from '@/types/Monster';
import {
  AKKHA_IDS,
  ARAXXOR_IDS,
  BABA_IDS,
  HUEYCOATL_IDS,
  KEPHRI_SHIELDED_IDS,
  KEPHRI_UNSHIELDED_IDS,
  NEX_IDS,
  NIGHTMARE_IDS,
  P3_WARDEN_IDS,
  SOTETSEG_IDS,
  TOA_OBELISK_IDS,
  VARDORVIS_IDS,
  VERZIK_IDS, YAMA_IDS,
  ZEBAK_IDS,
} from '@/lib/constants';
import { keys } from '@/utils';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { Factor } from '@/lib/Math';

export const getDefenceFloor = (m: Monster): number => {
  if (VERZIK_IDS.includes(m.id) || VARDORVIS_IDS.includes(m.id)) {
    return m.skills.def;
  }
  if (SOTETSEG_IDS.includes(m.id)) {
    return 100;
  }
  if (NIGHTMARE_IDS.includes(m.id)) {
    return 120;
  }
  if (AKKHA_IDS.includes(m.id)) {
    return 70;
  }
  if (BABA_IDS.includes(m.id)) {
    return 60;
  }
  if (KEPHRI_UNSHIELDED_IDS.includes(m.id) || KEPHRI_SHIELDED_IDS.includes(m.id)) {
    return 60;
  }
  if (ZEBAK_IDS.includes(m.id)) {
    return 50;
  }
  if (P3_WARDEN_IDS.includes(m.id)) {
    return 120;
  }
  if (TOA_OBELISK_IDS.includes(m.id)) {
    return 60;
  }
  if (NEX_IDS.includes(m.id)) {
    return 250;
  }
  if (ARAXXOR_IDS.includes(m.id)) {
    return 90;
  }
  if (HUEYCOATL_IDS.includes(m.id)) {
    return 120;
  }
  if (YAMA_IDS.includes(m.id)) {
    return 145;
  }

  // no limit
  return 0;
};

const applyDefenceReductions = (m: Monster): Monster => {
  const baseSkills = m.skills;
  const defenceFloor = getDefenceFloor(m);

  const reductions = m.inputs.defenceReductions;
  const newSkills = (current: Monster, skills: Partial<Monster['skills']>): Monster => {
    keys(skills).forEach((k) => {
      const floor = k === 'def' ? defenceFloor : 0;
      skills[k] = Math.max(floor, skills[k]!);
    });
    return ({
      ...current,
      skills: {
        ...current.skills,
        ...skills,
      },
    });
  };

  if (reductions.accursed) {
    m = newSkills(m, {
      def: Math.trunc(m.skills.def * 17 / 20),
      magic: Math.trunc(m.skills.magic * 17 / 20),
    });
  } else if (reductions.vulnerability) {
    // todo tome of water increases this to 15% reduction,
    // but how do we handle that?
    m = newSkills(m, {
      def: Math.trunc(m.skills.def * 9 / 10),
    });
  }

  for (let i = 0; i < reductions.elderMaul; i++) {
    m = newSkills(m, {
      def: m.skills.def - Math.trunc(m.skills.def * 35 / 100),
    });
  }
  for (let i = 0; i < reductions.dwh; i++) {
    m = newSkills(m, {
      def: m.skills.def - Math.trunc(m.skills.def * 3 / 10),
    });
  }

  const reduceArclight = (monster: Monster, iter: number, [num, den]: Factor): Monster => {
    if (iter === 0) {
      return monster;
    }

    return newSkills(monster, {
      atk: monster.skills.atk - (iter * (Math.trunc(num * baseSkills.atk / den) + 1)),
      str: monster.skills.str - (iter * (Math.trunc(num * baseSkills.str / den) + 1)),
      def: monster.skills.def - (iter * (Math.trunc(num * baseSkills.def / den) + 1)),
    });
  };
  m = reduceArclight(m, reductions.arclight, m.attributes.includes(MonsterAttribute.DEMON) ? [2, 20] : [1, 20]);
  m = reduceArclight(m, reductions.emberlight, m.attributes.includes(MonsterAttribute.DEMON) ? [3, 20] : [1, 20]);

  for (let i = 0; i < reductions.tonalztic; i++) {
    m = newSkills(m, {
      def: m.skills.def - Math.trunc(m.skills.magic / 10),
    });
  }

  if (reductions.seercull > 0) {
    m = newSkills(m, {
      magic: m.skills.magic - reductions.seercull,
    });
  }

  let bgsDmg = reductions.bgs;
  if (bgsDmg > 0) {
    const applyBgsDmg = (monster: Monster, k: keyof Monster['skills']): Monster => {
      const startLevel = monster.skills[k];
      const newMonster = newSkills(monster, { [k]: startLevel - bgsDmg });
      if (newMonster.skills[k] > 0) {
        // if a skill fails to drain to 0, even if because of a drain floor, the bgs does not propagate further
        bgsDmg = 0;
      } else {
        bgsDmg -= startLevel;
      }
      return newMonster;
    };

    // order matters here
    m = applyBgsDmg(m, 'def');
    m = applyBgsDmg(m, 'str');
    m = applyBgsDmg(m, 'atk');
    m = applyBgsDmg(m, 'magic');
    m = applyBgsDmg(m, 'ranged');
  }

  if (reductions.ayak > 0) {
    const newMagicDef = Math.max(0, m.defensive.magic - reductions.ayak);
    m = {
      ...m,
      defensive: {
        ...m.defensive,
        magic: newMagicDef,
      },
    };
  }

  return m;
};

export default applyDefenceReductions;
