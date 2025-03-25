import {
  describe, expect, test,
} from '@jest/globals';
import { getMonsters, INITIAL_MONSTER_INPUTS } from '@/lib/Monsters';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import applyCoxScaling from '@/lib/scaling/ChambersOfXeric';
import { Monster } from '@/types/Monster';
import { getTestMonster } from '@/tests/utils/TestUtils';

describe('stats should not be scaled with size=1 hp=99 cmb=126', () => {
  getMonsters()
    .filter((m) => m.attributes.includes(MonsterAttribute.XERICIAN))
    .forEach((m) => {
      test(`${m.name}#${m.version}`, () => {
        const withInputs: Monster = {
          ...m,
          inputs: {
            ...INITIAL_MONSTER_INPUTS,
            partySize: 1,
            partyMaxCombatLevel: 126,
            partyMaxHpLevel: 99,
            isFromCoxCm: false,
          },
        };

        const scaled = applyCoxScaling(withInputs);
        expect(scaled.skills).toStrictEqual(m.skills);
      });
    });
});

describe('cmb=126 hp=99 cm tekton', () => {
  test('size=1', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 1,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 450,
      atk: 585,
      def: 246,
      str: 585,
      magic: 246,
      ranged: 1,
    });
  });

  test('size=2', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 2,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 900,
      atk: 631,
      def: 248,
      str: 631,
      magic: 248,
      ranged: 1,
    });
  });

  test('size=3', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 3,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 900,
      atk: 637,
      def: 250,
      str: 637,
      magic: 250,
      ranged: 1,
    });
  });

  test('size=4', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 4,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1350,
      atk: 643,
      def: 284,
      str: 643,
      magic: 284,
      ranged: 1,
    });
  });

  test('size=5', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 5,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1350,
      atk: 690,
      def: 287,
      str: 690,
      magic: 287,
      ranged: 1,
    });
  });

  test('size=6', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 6,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1800,
      atk: 696,
      def: 290,
      str: 696,
      magic: 290,
      ranged: 1,
    });
  });

  test('size=7', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 7,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1800,
      atk: 702,
      def: 292,
      str: 702,
      magic: 292,
      ranged: 1,
    });
  });

  test('size=8', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 8,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 2250,
      atk: 706,
      def: 292,
      str: 706,
      magic: 292,
      ranged: 1,
    });
  });

  test('size=9', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 9,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 2250,
      atk: 712,
      def: 295,
      str: 712,
      magic: 295,
      ranged: 1,
    });
  });

  test('size=10', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 10,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 2700,
      atk: 760,
      def: 301,
      str: 760,
      magic: 301,
      ranged: 1,
    });
  });

  test('size=25', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 25,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 5850,
      atk: 888,
      def: 332,
      str: 888,
      magic: 332,
      ranged: 1,
    });
  });

  test('size=50', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 50,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 11700,
      atk: 1158,
      def: 390,
      str: 1158,
      magic: 390,
      ranged: 1,
    });
  });

  test('size=75', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 75,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 17100,
      atk: 1345,
      def: 438,
      str: 1345,
      magic: 438,
      ranged: 1,
    });
  });

  test('size=100', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 100,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 22950,
      atk: 1531,
      def: 491,
      str: 1531,
      magic: 491,
      ranged: 1,
    });
  });
});

describe('cmb=104 hp=89 cm tekton', () => {
  test('size=1', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 1,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 370,
      atk: 555,
      def: 232,
      str: 555,
      magic: 232,
      ranged: 1,
    });
  });

  test('size=2', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 2,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 741,
      atk: 598,
      def: 234,
      str: 598,
      magic: 234,
      ranged: 1,
    });
  });

  test('size=3', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 3,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 741,
      atk: 604,
      def: 236,
      str: 604,
      magic: 236,
      ranged: 1,
    });
  });

  test('size=4', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 4,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1111,
      atk: 610,
      def: 268,
      str: 610,
      magic: 268,
      ranged: 1,
    });
  });

  test('size=5', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 5,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1111,
      atk: 654,
      def: 271,
      str: 654,
      magic: 271,
      ranged: 1,
    });
  });

  test('size=6', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 6,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1482,
      atk: 660,
      def: 274,
      str: 660,
      magic: 274,
      ranged: 1,
    });
  });

  test('size=7', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 7,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1482,
      atk: 666,
      def: 276,
      str: 666,
      magic: 276,
      ranged: 1,
    });
  });

  test('size=8', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 8,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1852,
      atk: 670,
      def: 276,
      str: 670,
      magic: 276,
      ranged: 1,
    });
  });

  test('size=9', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 9,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1852,
      atk: 676,
      def: 279,
      str: 676,
      magic: 279,
      ranged: 1,
    });
  });

  test('size=10', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 10,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 2223,
      atk: 721,
      def: 284,
      str: 721,
      magic: 284,
      ranged: 1,
    });
  });

  test('size=25', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 25,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 4816,
      atk: 843,
      def: 313,
      str: 843,
      magic: 313,
      ranged: 1,
    });
  });

  test('size=50', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 50,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 9633,
      atk: 1098,
      def: 368,
      str: 1098,
      magic: 368,
      ranged: 1,
    });
  });

  test('size=75', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 75,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 14079,
      atk: 1276,
      def: 415,
      str: 1276,
      magic: 415,
      ranged: 1,
    });
  });

  test('size=100', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 100,
        partyMaxCombatLevel: 104,
        partyMaxHpLevel: 89,
        isFromCoxCm: true,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 18895,
      atk: 1453,
      def: 465,
      str: 1453,
      magic: 465,
      ranged: 1,
    });
  });
});

describe('cmb=126 hp=99 regulars', () => {
  test('size=1 shamans', () => {
    const base = getTestMonster('Lizardman shaman (Chambers of Xeric)', '', {
      inputs: {
        partySize: 1,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 190,
      atk: 130,
      def: 210,
      str: 130,
      magic: 130,
      ranged: 130,
    });
  });

  test('size=2 tekton', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 2,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 600,
      atk: 421,
      def: 207,
      str: 421,
      magic: 207,
      ranged: 1,
    });
  });

  test('size=3 vasa', () => {
    const base = getTestMonster('Vasa Nistirio', '', {
      inputs: {
        partySize: 3,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 600,
      atk: 1,
      def: 178,
      str: 1,
      magic: 250,
      ranged: 250,
    });
  });

  test('size=4 mystics', () => {
    const base = getTestMonster('Skeletal Mystic', '', {
      inputs: {
        partySize: 4,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 480,
      atk: 154,
      def: 192,
      str: 154,
      magic: 154,
      ranged: 1,
    });
  });

  test('size=5 tekton', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 5,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 900,
      atk: 460,
      def: 213,
      str: 460,
      magic: 213,
      ranged: 1,
    });
  });

  test('size=6 guardians', () => {
    const base = getTestMonster('Guardian (Chambers of Xeric)', '', {
      inputs: {
        partySize: 6,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        partySumMiningLevel: 93,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 664,
      atk: 166,
      def: 105,
      str: 166,
      magic: 1,
      ranged: 1,
    });
  });

  test('size=7 shamans', () => {
    const base = getTestMonster('Lizardman shaman (Chambers of Xeric)', '', {
      inputs: {
        partySize: 7,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 760,
      atk: 156,
      def: 222,
      str: 156,
      magic: 156,
      ranged: 156,
    });
  });

  test('size=8 guardians', () => {
    const base = getTestMonster('Guardian (Chambers of Xeric)', '', {
      inputs: {
        partySize: 8,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        partySumMiningLevel: 93,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 810,
      atk: 169,
      def: 106,
      str: 169,
      magic: 1,
      ranged: 1,
    });
  });

  test('size=25 guardians', () => {
    const base = getTestMonster('Guardian (Chambers of Xeric)', '', {
      inputs: {
        partySize: 25,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        partySumMiningLevel: 93,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 2002,
      atk: 212,
      def: 120,
      str: 212,
      magic: 1,
      ranged: 1,
    });
  });

  test('size=45 vespula', () => {
    const base = getTestMonster('Vespula', '', {
      inputs: {
        partySize: 45,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 4600,
      atk: 279,
      def: 119,
      str: 279,
      magic: 119,
      ranged: 279,
    });
  });

  test('size=80 shamans', () => {
    const base = getTestMonster('Lizardman shaman (Chambers of Xeric)', '', {
      inputs: {
        partySize: 80,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 7790,
      atk: 305,
      def: 342,
      str: 305,
      magic: 305,
      ranged: 305,
    });
  });

  test('size=100 vespula', () => {
    const base = getTestMonster('Vespula', '', {
      inputs: {
        partySize: 100,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 10200,
      atk: 393,
      def: 156,
      str: 393,
      magic: 156,
      ranged: 393,
    });
  });

  test('scav', () => {
    const base = getTestMonster('Scavenger beast', '', {
      inputs: {
        partySize: 1,
        partyMaxCombatLevel: 126,
        partyMaxHpLevel: 99,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 30,
      atk: 120,
      def: 45,
      str: 120,
      magic: 1,
      ranged: 1,
    });
  });
});

describe('cmb=114 hp=97 regulars', () => {
  test('size=1 vespula', () => {
    const base = getTestMonster('Vespula', '', {
      inputs: {
        partySize: 1,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 180,
      atk: 148,
      def: 87,
      str: 148,
      magic: 87,
      ranged: 148,
    });
  });

  test('size=2 tekton', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 2,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 542,
      atk: 416,
      def: 204,
      str: 416,
      magic: 204,
      ranged: 1,
    });
  });

  test('size=3 tekton', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 3,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 542,
      atk: 420,
      def: 206,
      str: 420,
      magic: 206,
      ranged: 1,
    });
  });

  test('size=4 guardians', () => {
    const base = getTestMonster('Guardian (Chambers of Xeric)', '', {
      inputs: {
        partySize: 4,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        partySumMiningLevel: 93,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 471,
      atk: 151,
      def: 100,
      str: 151,
      magic: 1,
      ranged: 1,
    });
  });

  test('size=5 vanguards', () => {
    const base = getTestMonster('Vanguard', '', {
      inputs: {
        partySize: 5,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 486,
      atk: 174,
      def: 164,
      str: 174,
      magic: 174,
      ranged: 174,
    });
  });

  test('size=6 vanguards', () => {
    const base = getTestMonster('Vanguard', '', {
      inputs: {
        partySize: 6,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 648,
      atk: 176,
      def: 165,
      str: 176,
      magic: 176,
      ranged: 176,
    });
  });

  test('size=7 vasa', () => {
    const base = getTestMonster('Vasa Nistirio', '', {
      inputs: {
        partySize: 7,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 1084,
      atk: 1,
      def: 183,
      str: 1,
      magic: 272,
      ranged: 272,
    });
  });

  test('size=8 shamans', () => {
    const base = getTestMonster('Lizardman shaman (Chambers of Xeric)', '', {
      inputs: {
        partySize: 8,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 855,
      atk: 154,
      def: 219,
      str: 154,
      magic: 154,
      ranged: 154,
    });
  });

  test('size=25 shamans', () => {
    const base = getTestMonster('Lizardman shaman (Chambers of Xeric)', '', {
      inputs: {
        partySize: 25,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 2223,
      atk: 194,
      def: 248,
      str: 194,
      magic: 194,
      ranged: 194,
    });
  });

  test('size=45 tekton', () => {
    const base = getTestMonster('Tekton', '', {
      inputs: {
        partySize: 45,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 6233,
      atk: 717,
      def: 274,
      str: 717,
      magic: 274,
      ranged: 1,
    });
  });

  test('size=80 guardians', () => {
    const base = getTestMonster('Guardian (Chambers of Xeric)', '', {
      inputs: {
        partySize: 80,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        partySumMiningLevel: 93,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 5617,
      atk: 324,
      def: 159,
      str: 324,
      magic: 1,
      ranged: 1,
    });
  });

  test('size=100 vasa', () => {
    const base = getTestMonster('Vasa Nistirio', '', {
      inputs: {
        partySize: 100,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 13821,
      atk: 1,
      def: 307,
      str: 1,
      magic: 594,
      ranged: 594,
    });
  });

  test('scav', () => {
    const base = getTestMonster('Scavenger beast', '', {
      inputs: {
        partySize: 1,
        partyMaxCombatLevel: 114,
        partyMaxHpLevel: 97,
        isFromCoxCm: false,
      },
    });

    const scaled = applyCoxScaling(base);
    expect(scaled.skills).toStrictEqual(<Monster['skills']>{
      hp: 27,
      atk: 117,
      def: 44,
      str: 117,
      magic: 1,
      ranged: 1,
    });
  });
});
