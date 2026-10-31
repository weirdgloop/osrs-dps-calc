import spellsRaw from '../../cdn/json/spells.json';

export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  base_xp: number;
  spellbook: Spellbook;
  element: Spellement;
}

export type Spellement = 'air' | 'water' | 'earth' | 'fire';

export const spells = spellsRaw as Spell[];

export function spellByName(name: string): Spell | null {
  return spells.find((s) => s.name === name) || null;
}

export function isBindSpell(spell: Spell | null): boolean {
  return spell !== null
    && ['Bind', 'Snare', 'Entangle']
      .includes(spell.name);
}

export function canUseSunfireRunes(spell: Spell | null): boolean {
  return spell?.element === 'fire';
}

// The available spellbooks
export type Spellbook = 'standard' | 'ancient' | 'lunar' | 'arceuus';
