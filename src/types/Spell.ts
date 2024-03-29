import spellsRaw from '../../cdn/json/spells.json';

export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  spellbook: Spellbook;
}

export const spells = spellsRaw as Spell[];

export function spellByName(name: string): Spell | null {
  return spells.find((s) => s.name === name) || null;
}

export function isFireSpell(spell: Spell | null): boolean {
  return spell !== null
      && ['Fire Strike', 'Fire Bolt', 'Fire Blast', 'Fire Wave', 'Fire Surge']
        .includes(spell.name);
}

export function isWaterSpell(spell: Spell | null): boolean {
  return spell !== null
      && ['Water Strike', 'Water Bolt', 'Water Blast', 'Water Wave', 'Water Surge']
        .includes(spell.name);
}

export function isBindSpell(spell: Spell | null): boolean {
  return spell !== null
    && ['Bind', 'Snare', 'Entangle'] // todo bind isn't actually added yet, but future-proofing
      .includes(spell.name);
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
