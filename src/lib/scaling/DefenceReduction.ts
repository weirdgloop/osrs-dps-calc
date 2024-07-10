import { Monster } from '@/types/Monster';
import { P3_WARDEN_IDS } from '@/lib/constants';
import { keys } from '@/utils';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { Factor } from '@/lib/Math';

const getDefenceFloor = (m: Monster): number => {
  if (m.name === 'Verzik Vitur' || m.name === 'Vardorvis') {
    return m.skills.def;
  }
  if (m.name === 'Sotetseg') {
    return 100;
  }
  if (m.name === 'The Nightmare' || m.name === 'Phosani\'s Nightmare') {
    return 120;
  }
  if (m.name === 'Akkha') {
    return 70;
  }
  if (m.name === 'Ba-Ba') {
    return 60;
  }
  if (m.name === 'Kephri') {
    return 60;
  }
  if (m.name === 'Zebak') {
    return 50;
  }
  if (P3_WARDEN_IDS.includes(m.id)) {
    return 120;
  }
  if (m.name === 'Obelisk') {
    return 60;
  }
  if (m.name === 'Nex') {
    return 250;
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

  return m;
};

export default applyDefenceReductions;
