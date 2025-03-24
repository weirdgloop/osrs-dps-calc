import { MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  COX_MAGIC_IS_DEFENSIVE_IDS,
  COX_USE_SINGLES_SCALING_IDS,
  GLOWING_CRYSTAL_IDS,
  GUARDIAN_IDS,
  OLM_IDS,
  OLM_MAGE_HAND_IDS,
  OLM_MELEE_HAND_IDS,
  TEKTON_IDS,
} from '@/lib/constants';
import { Monster } from '@/types/Monster';
import { addPercent, iSqrt } from '@/lib/Math';
import { max } from 'd3-array';

type MonsterSkills = Monster['skills'];
type MonsterSkill = keyof MonsterSkills;

interface SkillMeta {
  offensives: MonsterSkill[];
  baseOffensive: number;

  defensives: MonsterSkill[];
  baseDefensive: number;

  baseHp: number;
}

const CM_SCALE_PERCENT = 50;

// determine which skills should be scaled by which factor
const getSkillMeta = (m: Monster): SkillMeta => {
  const magicIsDefensive = COX_MAGIC_IS_DEFENSIVE_IDS.includes(m.id);

  const offensivesAll: MonsterSkill[] = ['atk', 'str', 'ranged'];
  const defensivesAll: MonsterSkill[] = ['def'];
  if (magicIsDefensive) {
    defensivesAll.push('magic');
  } else {
    offensivesAll.push('magic');
  }

  // don't scale skills set at 1, they should remain at 1
  const offensives = offensivesAll.filter((k) => m.skills[k] !== 1);
  const defensives = defensivesAll.filter((k) => m.skills[k] !== 1);

  // determine the "base" stat of remaining skills (they should all be the same since they're linked)
  const baseOffensive = max(offensives, (k) => m.skills[k]) ?? 1;
  const baseDefensive = max(defensives, (k) => m.skills[k]) ?? 1;

  const baseHp = GUARDIAN_IDS.includes(m.id)
    ? 151 + Math.trunc(m.inputs.partySumMiningLevel / m.inputs.partySize)
    : m.skills.hp;

  return {
    offensives,
    baseOffensive,

    defensives,
    baseDefensive,

    baseHp,
  };
};

// things intended to be fought solo (even though everything is technically multi)
// like scavenger beasts and vespine soldiers
const applySinglesCoxScaling = (m: Monster): Monster => {
  const { inputs, skills } = m;
  const {
    offensives, baseOffensive, defensives, baseDefensive, baseHp,
  } = getSkillMeta(m);

  // scaling factors based on clamped inputs
  let hpScaler = Math.max(Math.min(inputs.partyMaxCombatLevel, 126), 60);
  let statScaler = Math.max(Math.min(inputs.partyMaxHpLevel, 99), 55);

  // increase everything for cm
  if (inputs.isFromCoxCm) {
    statScaler = addPercent(statScaler, CM_SCALE_PERCENT);
    hpScaler = addPercent(hpScaler, CM_SCALE_PERCENT);
  }

  // determine the new values for each applicable stat
  const statChanges: Partial<MonsterSkills> = {};
  statChanges.hp = Math.max(Math.trunc(baseHp * hpScaler / 126), 5);
  for (const o of offensives) {
    statChanges[o] = Math.max(Math.trunc(baseOffensive * statScaler / 99), 1);
  }
  for (const d of defensives) {
    statChanges[d] = Math.max(Math.trunc(baseDefensive * statScaler / 99), 1);
  }

  return {
    ...m,
    skills: {
      ...skills,
      ...statChanges,
    },
  };
};

// everything intended to be fought in a group (most things overall) uses this
const applyMultiCoxScaling = (m: Monster): Monster => {
  const { inputs, skills, id } = m;
  const {
    offensives, baseOffensive, defensives, baseDefensive, baseHp,
  } = getSkillMeta(m);

  // clamp a bunch of input values
  const partySize = Math.min(Math.max(inputs.partySize, 1), 100);
  const partySizeM1 = partySize - 1;
  const highestComLevel = Math.max(Math.min(inputs.partyMaxCombatLevel, 126), 60);
  const highestHp = Math.max(Math.min(55 + Math.trunc(44 * inputs.partyMaxHpLevel / 99), 99), 55);

  // scale base stats by party member stats
  let offensive = Math.trunc(baseOffensive * highestHp / 99);
  let defensive = Math.trunc(baseDefensive * highestHp / 99);
  let hp = Math.trunc(baseHp * highestComLevel / 126);

  // scale everything based on party size in varying ways
  const offensiveScalePct = 100 + iSqrt(partySizeM1) * 7 + partySizeM1;
  offensive = Math.trunc(offensive * offensiveScalePct / 100);

  const defensiveScalePct = 100 + iSqrt(partySizeM1) + Math.trunc(partySizeM1 * 7 / 10);
  defensive = Math.trunc(defensive * defensiveScalePct / 100);

  hp += hp * Math.trunc(partySize * 50 / 100);

  // increase all stats for cm (with some exceptions)
  if (inputs.isFromCoxCm) {
    offensive = addPercent(offensive, CM_SCALE_PERCENT);

    if (!GLOWING_CRYSTAL_IDS.includes(id)) {
      hp = addPercent(hp, CM_SCALE_PERCENT);
    }

    if (GLOWING_CRYSTAL_IDS.includes(id)) {
      // not scaled
    } else if (TEKTON_IDS.includes(id)) { // tekton gets special treatment to make specs easier
      if (partySize < 4) { // especially for small party sizes
        defensive = addPercent(defensive, 20);
      } else {
        defensive = addPercent(defensive, 35);
      }
    } else {
      defensive = addPercent(defensive, CM_SCALE_PERCENT);
    }
  }

  // make the changeset (and clamp for sanity)
  const statChanges: Partial<MonsterSkills> = {};
  statChanges.hp = Math.max(Math.min(hp, 30_000), 50);
  for (const o of offensives) {
    statChanges[o] = Math.max(Math.min(offensive, 5_000), 50);
  }
  for (const d of defensives) {
    statChanges[d] = Math.max(Math.min(defensive, 20_000), 50);
  }

  return {
    ...m,
    skills: {
      ...skills,
      ...statChanges,
    },
  };
};

export const applyOlmScaling = (m: Monster): Monster => {
  const lhand = OLM_MELEE_HAND_IDS.includes(m.id);
  const rhand = OLM_MAGE_HAND_IDS.includes(m.id);

  // partySize - 3 * extraPhases, basically
  const partySizeScaleFactor = Math.min(m.inputs.partySize - 1, 50) - 3 * Math.trunc(Math.min(m.inputs.partySize, 50) / 8);

  const base = applyMultiCoxScaling(m);
  const magic: number = rhand ? Math.trunc(base.skills.magic / 2) : base.skills.magic;
  const hp = (lhand || rhand)
    ? 600 + 300 * partySizeScaleFactor
    : 800 + 400 * partySizeScaleFactor;

  return {
    ...base,
    skills: {
      ...base.skills,
      hp,
      magic,
    },
  };
};

const applyCoxScaling = (m: Monster): Monster => {
  if (!m.attributes.includes(MonsterAttribute.XERICIAN)) {
    return m;
  }

  if (COX_USE_SINGLES_SCALING_IDS.includes(m.id)) {
    return applySinglesCoxScaling(m);
  }

  if (OLM_IDS.includes(m.id)) {
    return applyOlmScaling(m);
  }

  return applyMultiCoxScaling(m);
};

export default applyCoxScaling;
