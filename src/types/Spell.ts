export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  spellbook: Spellbook;
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

// The available spellbooks
export type Spellbook = 'standard' | 'ancient' | 'lunar' | 'arceuus';
