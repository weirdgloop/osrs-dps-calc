import { describe, expect, test } from '@jest/globals';
import { applicableDefenceReductions } from '@/lib/MonsterScaling';
import { createMonsterInputs } from '@/lib/Monsters';
import { MonsterStore } from '@/state/MonsterStore';
import { monsterGroupFor } from '@/lib/MonsterForms';
import { MonsterDefinition, MonsterInputs } from '@/types/Monster';

const NONE: MonsterInputs['defenceReductions'] = {
  vulnerability: false,
  accursed: false,
  elderMaul: 0,
  dwh: 0,
  arclight: 0,
  emberlight: 0,
  bgs: 0,
  tonalztic: 0,
  seercull: 0,
  ayak: 0,
};

const withReductions = (def: MonsterDefinition, defenceReductions: MonsterInputs['defenceReductions']) => applicableDefenceReductions({
  ...def,
  inputs: { ...createMonsterInputs(def.id), monsterCurrentHp: def.skills.hp, defenceReductions },
});

const form = (name: string, label: string) => monsterGroupFor(name)!.forms.find((f) => f.label === label)!.monster;

describe('applicableDefenceReductions', () => {
  test('keeps reductions that still lower the new form\'s stats', () => {
    const zulrah = form('Zulrah', 'Tanzanite');
    const r = { ...NONE, dwh: 2, bgs: 50 };
    expect(withReductions(zulrah, r)).toEqual(r);
  });

  test('resets reductions that have no effect on the new form', () => {
    // Verzik's defence floor is its own defence level, so a DWH does nothing
    const verzik = form('Verzik Vitur', 'Normal mode, Phase 2');
    expect(withReductions(verzik, { ...NONE, dwh: 2 }).dwh).toBe(0);
  });

  test('ayak resets when the new form has no magic defence', () => {
    const magma = form('Zulrah', 'Magma'); // magic defence 0
    const r = withReductions(magma, { ...NONE, ayak: 30, dwh: 1 });
    expect(r.ayak).toBe(0);
    expect(r.dwh).toBe(1);
  });
});

describe('MonsterStore.selectForm', () => {
  test('carries applicable defence reductions over and resets current HP', () => {
    const store = new MonsterStore();
    store.select(form('Zulrah', 'Magma'));
    store.updateInputs({ defenceReductions: { dwh: 2 }, monsterCurrentHp: 10 });
    store.selectForm(form('Zulrah', 'Tanzanite'));
    expect(store.inputs.defenceReductions.dwh).toBe(2);
    expect(store.inputs.monsterCurrentHp).toBe(store.maxHp);
  });

  test('judges applicability on the scaled monster (Yama phase raises magic defence)', () => {
    const store = new MonsterStore();
    store.select(form('Yama', 'Phase 3'));
    store.updateInputs({ defenceReductions: { ayak: 30 } });
    store.selectForm(form('Yama', 'Normal'));
    expect(store.inputs.defenceReductions.ayak).toBe(30);
  });

  test('carries ToA invocation and path level over', () => {
    const [a, b] = monsterGroupFor('Crocodile')!.forms;
    const store = new MonsterStore();
    store.select(a.monster);
    store.updateInputs({ toaInvocationLevel: 300, toaPathLevel: 3 });
    store.selectForm(b.monster);
    expect(store.inputs.toaInvocationLevel).toBe(300);
    expect(store.inputs.toaPathLevel).toBe(3);
  });

  test('current HP reflects carried-over ToA scaling', () => {
    const toa = monsterGroupFor('Zebak')!.forms[0].monster;
    const store = new MonsterStore();
    store.select(toa);
    const unscaledHp = store.maxHp;
    store.updateInputs({ toaInvocationLevel: 300 });
    store.selectForm(toa);
    expect(store.maxHp).toBeGreaterThan(unscaledHp);
    expect(store.inputs.monsterCurrentHp).toBe(store.maxHp);
  });

  test('select (new monster) still resets defence reductions', () => {
    const store = new MonsterStore();
    store.updateInputs({ defenceReductions: { dwh: 2 } });
    store.select(form('Zulrah', 'Magma'));
    expect(store.inputs.defenceReductions.dwh).toBe(0);
  });
});
