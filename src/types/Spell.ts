import spellsRaw from '../../cdn/json/spells.json';

export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  spellbook: Spellbook;
  element: Spellement;
}

export type Spellement = 'air' | 'water' | 'earth' | 'fire';

export const spells = spellsRaw as Spell[];

export function spellByName(name: string): Spell | null {
  return spells.find((s) => s.name === name) || null;
}

export function isFireSpell(spell: Spell | null): boolean {
  return spell?.element === 'fire';
}

export function isWaterSpell(spell: Spell | null): boolean {
  return spell?.element === 'water';
}

export function isBindSpell(spell: Spell | null): boolean {
  return spell !== null
    && ['Bind', 'Snare', 'Entangle'] // todo bind isn't actually added yet, but future-proofing
      .includes(spell.name);
}

export function getSpellMaxHit(spell: Spell, magicLevel: number): number {
  if (!spell.element) {
    return spell?.max_hit;
  }

  const spellClass = spell.name.split(/ /)[1];
  switch (spellClass) {
    case 'Strike':
      if (magicLevel >= 13) return spellByName(`Fire ${spellClass}`)!.max_hit;
      if (magicLevel >= 9) return spellByName(`Earth ${spellClass}`)!.max_hit;
      if (magicLevel >= 5) return spellByName(`Water ${spellClass}`)!.max_hit;
      return spellByName(`Wind ${spellClass}`)!.max_hit;

    case 'Bolt':
      if (magicLevel >= 35) return spellByName(`Fire ${spellClass}`)!.max_hit;
      if (magicLevel >= 29) return spellByName(`Earth ${spellClass}`)!.max_hit;
      if (magicLevel >= 23) return spellByName(`Water ${spellClass}`)!.max_hit;
      return spellByName(`Wind ${spellClass}`)!.max_hit;

    case 'Blast':
      if (magicLevel >= 59) return spellByName(`Fire ${spellClass}`)!.max_hit;
      if (magicLevel >= 53) return spellByName(`Earth ${spellClass}`)!.max_hit;
      if (magicLevel >= 47) return spellByName(`Water ${spellClass}`)!.max_hit;
      return spellByName(`Wind ${spellClass}`)!.max_hit;

    case 'Wave':
      if (magicLevel >= 75) return spellByName(`Fire ${spellClass}`)!.max_hit;
      if (magicLevel >= 70) return spellByName(`Earth ${spellClass}`)!.max_hit;
      if (magicLevel >= 65) return spellByName(`Water ${spellClass}`)!.max_hit;
      return spellByName(`Wind ${spellClass}`)!.max_hit;

    case 'Surge':
      if (magicLevel >= 95) return spellByName(`Fire ${spellClass}`)!.max_hit;
      if (magicLevel >= 90) return spellByName(`Earth ${spellClass}`)!.max_hit;
      if (magicLevel >= 85) return spellByName(`Water ${spellClass}`)!.max_hit;
      return spellByName(`Wind ${spellClass}`)!.max_hit;

    default:
      // Note: Flames of Zamorak is expected to fall under this category
      console.warn(`No dynamic max hit available for ${spell}`);
      return spell?.max_hit;
  }
}

export function canUseSunfireRunes(spell: Spell | null): boolean {
  return isFireSpell(spell);

  // todo do we know for sure yet whether it's "fire spells" or "fire-rune spells"?
  // return spell !== null && (
  //   spell.name.includes('Fire')
  //   || spell.name.includes('Smoke')
  //   || spell.name.includes('Demonbane')
  //   || ['Claws of Guthix', 'Flames of Zamorak', 'Saradomin Strike', 'Iban Blast', 'Undead Grasp'].includes(spell.name)
  // );
}

// The available spellbooks
export type Spellbook = 'standard' | 'ancient' | 'lunar' | 'arceuus';
