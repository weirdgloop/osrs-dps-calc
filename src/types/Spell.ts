export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  spellbook: Spellbook;
}

export function isFireSpell(spell?: Spell): boolean {
  return spell !== undefined &&
      ['Fire Blast', 'Fire Bolt', 'Fire Strike', 'Fire Surge']
          .includes(spell.name);
}

// The available spellbooks
export type Spellbook = 'standard' | 'ancient' | 'lunar' | 'arceuus';