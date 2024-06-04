import { Monster } from '@/types/Monster';
import { TOB_EM_MONSTER_IDS, TOB_MONSTER_IDS } from '@/lib/constants';
import { Factor } from '@/lib/Math';

const ENTRY_MODE_SCALING: { [partySize: number]: Factor } = {
  1: [10, 40],
  2: [19, 40],
  3: [27, 40],
  4: [34, 40],
  5: [40, 40],
};

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
    const factor = ENTRY_MODE_SCALING[partySize];
    return {
      ...m,
      skills: {
        ...m.skills,
        hp: Math.trunc(m.skills.hp * factor[0] / factor[1]),
      },
    };
  }

  return m;
};

export default applyTobScaling;
