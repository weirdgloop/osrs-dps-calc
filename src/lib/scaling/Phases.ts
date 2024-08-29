import { Monster } from '@/types/Monster';

const applyMonsterPhases = (m: Monster): Monster => {
  if (!m.inputs.phase) {
    return m;
  }

  switch (m.name) {
    case 'Araxxor':
      if (m.inputs.phase === 'Enraged') {
        return {
          ...m,
          skills: {
            ...m.skills,
            def: m.skills.def + 35,
          },
        };
      }
      return m;

    default:
      return m;
  }
};

export default applyMonsterPhases;
