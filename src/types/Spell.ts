export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  spellbook: Spellbook;
}

export function isFireSpell(spell?: Spell): boolean {
  return spell !== undefined &&
      ['Fire Strike', 'Fire Bolt', 'Fire Blast', 'Fire Wave', 'Fire Surge']
          .includes(spell.name);
}

export function isWaterSpell(spell?: Spell): boolean {
  return spell !== undefined &&
      ['Water Strike', 'Water Bolt', 'Water Blast', 'Water Wave', 'Water Surge']
          .includes(spell.name);
}

// The available spellbooks
export type Spellbook = 'standard' | 'ancient' | 'lunar' | 'arceuus';