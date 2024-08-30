import { Monster } from '@/types/Monster';
import { ARAXXOR_IDS } from '@/lib/constants';

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

  return m;
};

export default applyMonsterPhases;
