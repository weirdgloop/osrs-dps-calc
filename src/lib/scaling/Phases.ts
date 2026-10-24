import { Monster } from '@/types/Monster';
import {
  ARAXXOR_IDS, BORK_IDS, BORK_PHASES, YAMA_IDS,
} from '@/lib/constants';

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
        magic: m.skills.magic + 28,
        ranged: m.skills.ranged + 31,
      },
    };
  }

  // yama goes to 60 magic defence if the tank is using magic
  if (YAMA_IDS.includes(m.id) && m.version !== 'Phase 3') {
    const mdef = m.inputs.phase === 'Tank using magic' ? 60 : -30;
    return {
      ...m,
      defensive: {
        ...m.defensive,
        magic: mdef,
      },
    };
  }

  if (BORK_IDS.includes(m.id)) {
    const phase = m.inputs.phase ?? BORK_PHASES[0];
    if (phase === 'Stunned') {
      return m; // full-accuracy not handled here
    }

    const magicResist = 2 * BORK_PHASES.indexOf(phase);
    const flatArmour = magicResist + 8;
    return {
      ...m,
      defensive: {
        ...m.defensive,
        flat_armour: flatArmour,
        magic_resistance: magicResist,
      },
    };
  }

  return m;
};

export default applyMonsterPhases;
