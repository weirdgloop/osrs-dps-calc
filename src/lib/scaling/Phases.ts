import { Monster, MonsterInputs } from '@/types/Monster';
import { ARAXXOR_IDS, YAMA_IDS } from '@/lib/constants';

const applyMonsterPhases = (m: Monster, inputs: MonsterInputs): Monster => {
  if (!inputs.phase) {
    return m;
  }

  if (ARAXXOR_IDS.includes(m.id) && inputs.phase === 'Enraged') {
    return {
      ...m,
      skills: {
        ...m.skills,
        def: m.skills.def + 35,
        magic: m.skills.magic + 28,
        ranged: m.skills.ranged + 31,
      },
    };
  }

  // yama goes to 60 magic defence if the tank is using magic
  if (YAMA_IDS.includes(m.id) && m.version !== 'Enraged') {
    const mdef = inputs.phase === 'Tank using magic' ? 60 : -30;
    return {
      ...m,
      defensive: {
        ...m.defensive,
        magic: mdef,
      },
    };
  }

  return m;
};

export default applyMonsterPhases;
