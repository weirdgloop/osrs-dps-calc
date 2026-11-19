import { describe, expect, test } from '@jest/globals';
import { fuzzyFilter } from 'fuzzbunny';
import {
  baseMonsterName, findFormIndex, groupMonsterForms, MONSTER_GROUPS, monsterGroupFor,
} from '@/lib/MonsterForms';
import { availableMonsters, MonsterStore } from '@/state/MonsterStore';
import { MonsterDefinition } from '@/types/Monster';

// forms of one exact monster name (groups span "Man", "Man (East Ardougne)", …)
const forms = (name: string) => monsterGroupFor(baseMonsterName(name))!.forms.filter((f) => f.monster.name === name);

const base: MonsterDefinition = {
  id: 999991,
  name: 'Test monster',
  version: 'A',
  level: 10,
  size: 1,
  speed: 4,
  style: 'slash',
  maxHit: 5,
  skills: {
    atk: 1, def: 1, hp: 10, magic: 1, ranged: 1, str: 1,
  },
  offensive: {
    atk: 0, magic: 0, magic_str: 0, ranged: 0, ranged_str: 0, str: 0,
  },
  defensive: {
    flat_armour: 0, stab: 0, slash: 0, crush: 0, magic: 0, light: 0, standard: 0, heavy: 0,
  },
  attributes: [],
  weakness: null,
  immunities: { burn: null },
  is_slayer_monster: false,
};

describe('MonsterForms: one option per entry', () => {
  test('every entry is its own form, nothing merged', () => {
    expect(MONSTER_GROUPS.flatMap((g) => g.forms).length).toBe(availableMonsters.length);
    expect(forms('Man')).toHaveLength(13);
    expect(monsterGroupFor('Man')!.forms).toHaveLength(16);
  });

  test('identical stats are still separate forms', () => {
    const [g] = groupMonsterForms([{ ...base }, { ...base, id: 999992, version: 'B' }]);
    expect(g.forms.map((f) => f.label)).toEqual(['A', 'B']);
  });

  test('label is the entry\'s version', () => {
    expect(forms('Man').map((f) => f.label)).toContain('4, Musa Point');
    const [g] = groupMonsterForms([{ ...base, version: undefined }]);
    expect(g.forms[0].label).toBe('');
  });
});

describe('MonsterForms: gearscape-style grouping', () => {
  test('baseMonsterName drops a trailing parenthetical', () => {
    expect(baseMonsterName('Man (East Ardougne)')).toBe('Man');
    expect(baseMonsterName("Zombie (Tarn's Lair)")).toBe('Zombie');
    expect(baseMonsterName('Verzik Vitur')).toBe('Verzik Vitur');
  });

  test('variants with a parenthetical name are forms of the base monster', () => {
    const man = monsterGroupFor('Man')!;
    expect(new Set(man.forms.map((f) => f.monster.name))).toEqual(new Set(['Man', 'Man (East Ardougne)', 'Man (level 4)']));
    expect(monsterGroupFor('Man (East Ardougne)')).toBe(man);
    expect(MONSTER_GROUPS.some((g) => g.name === 'Man (East Ardougne)')).toBe(false);
  });

  test('names differing only by case are one group, named with the most common casing', () => {
    const lower = MONSTER_GROUPS.map((g) => g.name.toLowerCase());
    expect(new Set(lower).size).toBe(lower.length);
    const moss = monsterGroupFor('Moss Giant (Iorwerth Dungeon)')!;
    expect(monsterGroupFor('Moss giant')).toBe(moss);
    expect(moss.name).toBe('Moss giant');
    expect(moss.forms).toHaveLength(4);
    expect(moss.forms[0].monster.name).toBe('Moss giant');
    expect(monsterGroupFor('Black knight')!.name).toBe('Black Knight');
  });

  test('title is "Name (version) (level)"', () => {
    const titles = monsterGroupFor('Man')!.forms.map((f) => f.title);
    expect(titles).toContain('Man (Al Kharid) (2)');
    expect(titles).toContain('Man (4, Musa Point) (2)');
    expect(titles).toContain('Man (East Ardougne) (2)');
  });

  test('titles are unique within a group', () => {
    MONSTER_GROUPS.forEach((g) => {
      const titles = g.forms.map((f) => f.title);
      expect(new Set(titles).size).toBe(titles.length);
    });
  });
});

describe('MonsterForms: order and default', () => {
  test('defaults to the plain-named, post-quest form, else first non-quest, else first', () => {
    expect(monsterGroupFor('Man')!.forms[0].monster.name).toBe('Man');
    expect(forms('Vardorvis')[0].label).toBe('Post-quest');
    expect(forms('Vorkath')[0].label).toBe('Post-quest');
    expect(forms('Menaphite Thug')[0].label).toBe('After Quest');
    expect(forms('Phantom Muspah')[0].label).toBe('Melee');
    expect(forms('Zulrah')[0].label).toBe('Magma');
  });

  test('plain-named entries come before named variants', () => {
    const names = monsterGroupFor('Man')!.forms.map((f) => f.monster.name);
    expect(names.slice(0, 13).every((n) => n === 'Man')).toBe(true);
    expect(names.slice(13).every((n) => n !== 'Man')).toBe(true);
  });

  test('quest variants are listed after every non-quest form', () => {
    const isQuest = (label: string) => /quest/i.test(label) && !/post-?quest|after quest/i.test(label);
    MONSTER_GROUPS.forEach((g) => {
      const flags = g.forms.map((f) => isQuest(f.label));
      const firstQuest = flags.indexOf(true);
      if (firstQuest !== -1) expect(flags.slice(firstQuest).every((q) => q)).toBe(true);
    });
    expect(monsterGroupFor('Phantom Muspah')!.forms.map((f) => f.label)).toEqual([
      'Melee', 'Post-shield', 'Ranged', 'Shielded', 'Teleporting',
      'Melee (Quest)', 'Post-shield (Quest)', 'Ranged (Quest)', 'Shielded (Quest)', 'Teleporting (Quest)',
    ]);
  });
});

describe('MonsterForms: lookup and search', () => {
  test('findFormIndex returns each entry\'s own form, even when id and version repeat (Jhallan)', () => {
    MONSTER_GROUPS.forEach((g) => g.forms.forEach((f, i) => {
      expect(findFormIndex(g, f.monster)).toBe(i);
    }));
  });

  test('findFormIndex finds the selected form through the store', () => {
    MONSTER_GROUPS.filter((g) => g.forms.length > 1).forEach((g) => g.forms.forEach((f, i) => {
      const store = new MonsterStore();
      store.select(f.monster);
      expect(findFormIndex(g, store.definition)).toBe(i);
    }));
  });

  test('duplicate titles all get their HP', () => {
    expect(monsterGroupFor('Jhallan')!.forms.map((f) => f.title).sort())
      .toEqual(['Jhallan (491) (1 HP)', 'Jhallan (491) (1500 HP)']);
    expect(monsterGroupFor('Totem')!.forms.map((f) => f.title)).toEqual([
      "Totem (Phosani's Nightmare) (0) (200 HP) #1",
      "Totem (Phosani's Nightmare) (0) (200 HP) #2",
      'Totem (The Nightmare) (0) (300 HP) #1',
      'Totem (The Nightmare) (0) (300 HP) #2',
    ]);
  });

  test('findFormIndex falls back to id + version for an equal copy', () => {
    const g = monsterGroupFor('Zulrah')!;
    const copy = { ...g.forms[2].monster };
    expect(findFormIndex(g, copy)).toBe(2);
  });

  test('search text includes versions and variant names', () => {
    expect(monsterGroupFor('Man')!.searchText).toContain('East Ardougne');
    const hits = fuzzyFilter(
      MONSTER_GROUPS.map((g) => ({ g, s: `${g.name} ${g.searchText}` })),
      'zulrah magma',
      { fields: ['s'] },
    );
    expect(hits.map((h) => h.item.g.name)).toContain('Zulrah');
  });
});
