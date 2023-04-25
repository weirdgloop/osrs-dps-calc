export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  spellbook: Spellbook;
}

// The available spellbooks
export type Spellbook = 'standard' | 'ancient' | 'lunar' | 'arceuus';