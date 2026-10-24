// this file exists to prevent an import cycle

import { Player } from '@/types/Player';
import { spellByName } from '@/types/Spell';

function getSpellMaxHit(player: Player): number {
  const { spell } = player;
  if (!spell) {
    return 0;
  }

  if (!spell.element) {
    return spell.max_hit;
  }

  const spellClass = spell.name.split(/ /)[1];
  const magicLevel = player.skills.magic;

  let max: number = 0;
  switch (spellClass) {
    case 'Strike':
      if (magicLevel >= 13) max = spellByName(`Fire ${spellClass}`)!.max_hit;
      else if (magicLevel >= 9) max = spellByName(`Earth ${spellClass}`)!.max_hit;
      else if (magicLevel >= 5) max = spellByName(`Water ${spellClass}`)!.max_hit;
      else max = spellByName(`Wind ${spellClass}`)!.max_hit;
      break;

    case 'Bolt':
      if (magicLevel >= 35) max = spellByName(`Fire ${spellClass}`)!.max_hit;
      else if (magicLevel >= 29) max = spellByName(`Earth ${spellClass}`)!.max_hit;
      else if (magicLevel >= 23) max = spellByName(`Water ${spellClass}`)!.max_hit;
      else max = spellByName(`Wind ${spellClass}`)!.max_hit;
      break;

    case 'Blast':
      if (magicLevel >= 59) max = spellByName(`Fire ${spellClass}`)!.max_hit;
      else if (magicLevel >= 53) max = spellByName(`Earth ${spellClass}`)!.max_hit;
      else if (magicLevel >= 47) max = spellByName(`Water ${spellClass}`)!.max_hit;
      else max = spellByName(`Wind ${spellClass}`)!.max_hit;
      break;

    case 'Wave':
      if (magicLevel >= 75) max = spellByName(`Fire ${spellClass}`)!.max_hit;
      else if (magicLevel >= 70) max = spellByName(`Earth ${spellClass}`)!.max_hit;
      else if (magicLevel >= 65) max = spellByName(`Water ${spellClass}`)!.max_hit;
      else max = spellByName(`Wind ${spellClass}`)!.max_hit;
      break;

    case 'Surge':
      if (magicLevel >= 95) max = spellByName(`Fire ${spellClass}`)!.max_hit;
      else if (magicLevel >= 90) max = spellByName(`Earth ${spellClass}`)!.max_hit;
      else if (magicLevel >= 85) max = spellByName(`Water ${spellClass}`)!.max_hit;
      else max = spellByName(`Wind ${spellClass}`)!.max_hit;
      break;

    default:
      throw new Error(`No dynamic max hit available for ${spell}`);
  }

  if (spell.element === 'fire' && player.buffs.fragmentOfFire) {
    max += 2;
  } else if (spell.element === 'earth' && player.buffs.fragmentOfEarth) {
    max += 2;
  } else if (spell.element === 'water' && player.buffs.fragmentOfWater) {
    max += 2;
  } else if (spell.element === 'air' && player.buffs.fragmentOfWind) {
    max += 2;
  }

  return max;
}

export default getSpellMaxHit;
