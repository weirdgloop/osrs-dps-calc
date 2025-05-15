import { Monster } from '@/types/Monster';
import { ARAXXOR_IDS, YAMA_IDS } from '@/lib/constants';

const applyMonsterPhases = (m: Monster): Monster => {
  if (!m.inputs.phase) {
    return m;
  }

  if (ARAXXOR_IDS.includes(m.id) && m.inputs.phase === 'Enraged') {
    return {
      ...m,
      skills: {
        ...m.skills,
        def: m.skills.def + 35,
      },
    };
  }

  // yama goes to 60 magic defence if the tank is using magic
  if (YAMA_IDS.includes(m.id) && m.version !== 'Enraged') {
    const mdef = m.inputs.phase === 'Tank using magic' ? 60 : -30;
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
