import { lerp } from '@/lib/Math';
import { Monster } from '@/types/Monster';

interface VardNumbers {
  maxHp: number,
  str: [start: number, end: number],
  def: [start: number, end: number],
}

const getVardNumbers = (m: Monster): VardNumbers => {
  switch (m.version) {
    case 'Quest':
      return {
        maxHp: 500,
        str: [210, 280],
        def: [180, 130],
      };

    case 'Awakened':
      return {
        maxHp: 1400,
        str: [391, 522],
        def: [268, 181],
      };

    default:
      return {
        maxHp: 700,
        str: [270, 360],
        def: [215, 145],
      };
  }
};

const applyVardScaling = (m: Monster): Monster => {
  const { inputs } = m;

  if (m.name !== 'Vardorvis') {
    return m;
  }

  // vard's strength and defence scale linearly throughout the fight based on hp
  const vardRanges = getVardNumbers(m);
  const currHp = Number.isFinite(inputs.monsterCurrentHp) ? inputs.monsterCurrentHp : vardRanges.maxHp;
  return {
    ...m,
    skills: {
      ...m.skills,
      str: lerp(currHp, vardRanges.maxHp, 0, vardRanges.str[0], vardRanges.str[1]),
      def: lerp(currHp, vardRanges.maxHp, 0, vardRanges.def[0], vardRanges.def[1]),
    },
  };
};

export default applyVardScaling;
