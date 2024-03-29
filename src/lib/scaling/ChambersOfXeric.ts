import { MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  ABYSSAL_PORTAL_IDS,
  GLOWING_CRYSTAL_IDS,
  GUARDIAN_IDS,
  OLM_HEAD_IDS,
  OLM_IDS,
  SCAVENGER_BEAST_IDS,
  TEKTON_IDS,
} from '@/lib/constants';
import { Monster } from '@/types/Monster';

const applyCoxScaling = (m: Monster): Monster => {
  const { inputs, attributes } = m;

  if (!attributes.includes(MonsterAttribute.XERICIAN)) {
    return m;
  }

  const cmb = Math.min(126, Math.max(3, inputs.partyMaxCombatLevel));
  const hp = Math.min(99, Math.max(1, inputs.partyMaxHpLevel));
  const min = Math.min(99, Math.max(1, inputs.partyAvgMiningLevel));
  const ps = Math.min(100, Math.max(1, inputs.partySize));
  const cm = inputs.isFromCoxCm;

  const sqrt = (x: number) => Math.trunc(Math.sqrt(x));

  // olm does everything differently
  if (OLM_IDS.includes(m.id)) {
    const olmHp = () => (OLM_HEAD_IDS.includes(m.id) ? 400 : 300) * (ps - Math.trunc(ps / 8) * 3 + 1);
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
    if (SCAVENGER_BEAST_IDS.includes(m.id)) { // no scaling
      return base;
    }
    const baseHp = GUARDIAN_IDS.includes(m.id) ? 151 + min : m.skills.hp;
    const c = cm && !GLOWING_CRYSTAL_IDS.includes(m.id);
    return Math.trunc(Math.trunc(baseHp * cmb / 126) * (Math.trunc(ps / 2) + 1) * (c ? 3 : 2) / 2);
  };

  const scaleDefence = (base: number) => {
    const f = TEKTON_IDS.includes(m.id) ? 5 : 2;
    const c = cm && !GLOWING_CRYSTAL_IDS.includes(m.id);
    return Math.trunc(Math.trunc(Math.trunc(base * (Math.trunc(hp * 4 / 9) + 55) / 99) * (sqrt(ps - 1) + Math.trunc((ps - 1) * 7 / 10) + 100) / 100) * (c ? f + 1 : f) / f);
  };

  const scaleOffence = (base: number, f: number = 2) => {
    if (ABYSSAL_PORTAL_IDS.includes(m.id)) {
      return scaleDefence(base);
    }
    return Math.trunc(Math.trunc(Math.trunc(base * (Math.trunc(hp * 4 / 9) + 55) / 99) * (sqrt(ps - 1) * 7 + (ps - 1) + 100) / 100) * (cm ? f + 1 : f) / f);
  };

  const scaleMagic = (base: number) => {
    const f = TEKTON_IDS.includes(m.id) ? 5 : 2;
    return scaleOffence(base, f);
  };

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
};

export default applyCoxScaling;
