import { availableMonsters } from '@/state/MonsterStore';
import { MonsterDefinition } from '@/types/Monster';

export interface MonsterForm {
  label: string;
  title: string;
  monster: MonsterDefinition;
}

export interface MonsterGroup {
  name: string;
  forms: MonsterForm[];
  searchText: string;
}

export const baseMonsterName = (name: string): string => name.replace(/\s*\([^()]*\)$/, '') || name;

const groupKey = (name: string) => baseMonsterName(name).toLowerCase();
const isPlain = (f: MonsterForm, key: string) => f.monster.name.toLowerCase() === key;

const POST_QUEST = /post-?quest|after quest/i;
const QUEST = /quest/i;
const isQuestForm = (f: Pick<MonsterForm, 'label'>): boolean => QUEST.test(f.label) && !POST_QUEST.test(f.label);

const formTitle = (m: MonsterDefinition): string => `${m.name}${m.version ? ` (${m.version})` : ''}${m.level !== undefined ? ` (${m.level})` : ''}`;

// Some entries share name, version and level (e.g. Jhallan)
const disambiguateTitles = (forms: MonsterForm[]): void => {
  const count = (title: string) => forms.filter((f) => f.title === title).length;
  const repeated = forms.map((f) => count(f.title) > 1);
  forms.forEach((f, i) => {
    if (repeated[i]) f.title = `${f.title} (${f.monster.skills.hp} HP)`;
  });
  const stillRepeated = forms.map((f) => count(f.title) > 1);
  const seen = new Map<string, number>();
  forms.forEach((f, i) => {
    const n = (seen.get(f.title) ?? 0) + 1;
    seen.set(f.title, n);
    if (stillRepeated[i]) f.title = `${f.title} #${n}`;
  });
};

const defaultFormIndex = (forms: MonsterForm[], key: string): number => {
  const indexed = forms.map((f, i) => ({ f, i }));
  const plain = indexed.filter(({ f }) => isPlain(f, key));
  const pool = plain.length ? plain : indexed;
  const postQuest = pool.find(({ f }) => POST_QUEST.test(f.label));
  if (postQuest) return postQuest.i;
  const nonQuest = pool.find(({ f }) => !QUEST.test(f.label));
  return (nonQuest ?? pool[0]).i;
};

export const groupMonsterForms = (monsters: readonly MonsterDefinition[]): MonsterGroup[] => {
  const byKey = new Map<string, MonsterForm[]>();
  monsters.forEach((m) => {
    const key = groupKey(m.name);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push({ label: m.version ?? '', title: formTitle(m), monster: m });
  });

  return [...byKey].map(([key, forms]) => {
    // Some names differ only by case (e.g. "Moss Giant", "Moss giant"), so use the most common spelling
    const spellings = forms.map((f) => baseMonsterName(f.monster.name));
    const count = (n: string) => spellings.filter((x) => x === n).length;
    const name = spellings.reduce((best, n) => (count(n) > count(best) ? n : best));
    const [def] = forms.splice(defaultFormIndex(forms, key), 1);
    const ordered = [
      def,
      ...forms.filter((f) => !isQuestForm(f) && isPlain(f, key)),
      ...forms.filter((f) => !isQuestForm(f) && !isPlain(f, key)),
      ...forms.filter(isQuestForm),
    ];
    disambiguateTitles(ordered);
    const searchText = [...new Set(ordered.flatMap((f) => [f.monster.name, f.label]))]
      .filter((t) => t && t !== name)
      .join(' ');
    return { name, forms: ordered, searchText };
  });
};

const stats = (m: MonsterDefinition) => JSON.stringify([m.skills, m.offensive, m.defensive]);

export const findFormIndex = (group: MonsterGroup, monster: MonsterDefinition): number => {
  const matches = group.forms
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => f.monster.id === monster.id && f.monster.name === monster.name && f.monster.version === monster.version);
  return (matches.find(({ f }) => stats(f.monster) === stats(monster)) ?? matches[0])?.i ?? -1;
};

export const MONSTER_GROUPS: MonsterGroup[] = groupMonsterForms(availableMonsters);

const MONSTER_GROUPS_BY_KEY: Map<string, MonsterGroup> = new Map(MONSTER_GROUPS.map((g) => [g.name.toLowerCase(), g]));

export const monsterGroupFor = (name: string): MonsterGroup | undefined => MONSTER_GROUPS_BY_KEY.get(groupKey(name));
