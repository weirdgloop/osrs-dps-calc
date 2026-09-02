import { describe, expect, test } from '@jest/globals';
import { getTestMonster } from '@/tests/utils/TestUtils';
import applyDefenceReductions from '@/lib/scaling/DefenceReduction';

describe('Single source of def reduction', () => {
  test('shadow barrage', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.shadowBarrage = true;
    m = applyDefenceReductions(m);
    expect(m.skills.atk).toBe(167);
    expect(m.skills.str).toBe(167);
    expect(m.skills.def).toBe(167);
  });

  test('accursed sceptre', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.accursed = true;
    m = applyDefenceReductions(m);
    expect(m.skills.def).toBe(170);
    expect(m.skills.magic).toBe(170);
  });

  test('vulnerability', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.vulnerability = true;
    m = applyDefenceReductions(m);
    expect(m.skills.def).toBe(180);
  });

  test('seercull', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.seercull = 10;
    m = applyDefenceReductions(m);
    expect(m.skills.magic).toBe(190);
  });
});

describe('Multiple sources of def reduction', () => {
  test('shadow barrage + accursed', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.shadowBarrage = true;
    m.inputs.defenceReductions.accursed = true;
    m = applyDefenceReductions(m);
    expect(m.skills.def).toBe(167);
    expect(m.skills.magic).toBe(170);
  });

  test('vuln + accursed', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.vulnerability = true;
    m.inputs.defenceReductions.accursed = true;
    m = applyDefenceReductions(m);
    expect(m.skills.def).toBe(170);
    expect(m.skills.magic).toBe(170);
  });

  test('vuln + shadow barrage', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.vulnerability = true;
    m.inputs.defenceReductions.shadowBarrage = true;
    m = applyDefenceReductions(m);
    expect(m.skills.def).toBe(180);
  });

  test('accursed + seercull', () => {
    let m = getTestMonster('Giant Mole');
    m.inputs.defenceReductions.accursed = true;
    m.inputs.defenceReductions.seercull = 50;
    m = applyDefenceReductions(m);
    expect(m.skills.def).toBe(170);
    expect(m.skills.magic).toBe(150);
  });
});
