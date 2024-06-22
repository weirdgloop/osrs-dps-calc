import { Monster } from '@/types/Monster';
import { P3_WARDEN_IDS } from '@/lib/constants';
import { keys } from '@/utils';
import { MonsterAttribute } from '@/enums/MonsterAttribute';

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

  if (reductions.arclight > 0) {
    // arclight always applies against base stats
    // https://discord.com/channels/177206626514632704/1098698914498101368/1201061390727794728 (wiki server)
    const arclightDivisor = m.attributes.includes(MonsterAttribute.DEMON) ? 10 : 20;
    m = newSkills(m, {
      atk: m.skills.atk - (reductions.arclight * (Math.trunc(baseSkills.atk / arclightDivisor) + 1)),
      str: m.skills.str - (reductions.arclight * (Math.trunc(baseSkills.str / arclightDivisor) + 1)),
      def: m.skills.def - (reductions.arclight * (Math.trunc(baseSkills.def / arclightDivisor) + 1)),
    });
  }

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
