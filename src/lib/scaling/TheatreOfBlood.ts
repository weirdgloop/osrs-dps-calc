import { Monster } from '@/types/Monster';
import { TOB_EM_MONSTER_IDS, TOB_MONSTER_IDS } from '@/lib/constants';

const applyTobScaling = (m: Monster): Monster => {
  const { inputs } = m;

  // tob only scales hp and nothing else
  if (TOB_MONSTER_IDS.includes(m.id)) {
    const partySize = Math.min(5, Math.max(3, inputs.partySize));
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: Math.trunc(m.skills.hp * (partySize + 3) / 8),
      },
    };
  }

  if (TOB_EM_MONSTER_IDS.includes(m.id)) {
    const partySize = Math.min(5, Math.max(1, inputs.partySize));
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: Math.trunc(m.skills.hp * partySize / 5),
      },
    };
  }

  return m;
};

export default applyTobScaling;
