import { describe, test, expect } from '@jest/globals';
import { getTestMonsterById } from '@/tests/utils/TestUtils';
import applyToaScaling from '@/lib/scaling/TombsOfAmascut';
import {
  AKKHA_IDS,
  AKKHA_SHADOW_IDS,
  BABA_IDS,
  KEPHRI_OVERLORD_IDS,
  KEPHRI_SHIELDED_IDS,
  KEPHRI_UNSHIELDED_IDS,
  P2_WARDEN_IDS,
  P3_WARDEN_IDS,
  TOA_WARDEN_CORE_EJECTED_IDS,
  TOA_OBELISK_IDS,
  ZEBAK_IDS,
} from '@/lib/constants';

/* eslint-disable quote-props */
const MONSTER_IDS: { [name: string]: number } = {
  'Ba-Ba': BABA_IDS[0],
  'Kephri (shield up)': KEPHRI_SHIELDED_IDS[0],
  'Kephri (shield down)': KEPHRI_UNSHIELDED_IDS[0],
  'Spitting/Soldier/Arcane Scarabs': KEPHRI_OVERLORD_IDS[0],
  'Akkha': AKKHA_IDS[0],
  "Akkha's Shadow": AKKHA_SHADOW_IDS[0],
  'Zebak': ZEBAK_IDS[0],
  'Obelisk': TOA_OBELISK_IDS[0],
  'Wardens P2': P2_WARDEN_IDS[0],
  'Core': TOA_WARDEN_CORE_EJECTED_IDS[0],
  'Wardens P3': P3_WARDEN_IDS[0],
};
/* eslint-enable quote-props */

describe('Solo', () => {
  // ty orion!
  // https://github.com/weirdgloop/osrs-dps-calc/issues/158#issuecomment-2148088446
  /* eslint-disable quote-props */
  const testData: { [raidLevel: number]: { [monster: string]: [pathLevel: number, hp: number] } } = {
    150: {
      'Ba-Ba': [0, 610],
      'Kephri (shield up)': [0, 240],
      'Kephri (shield down)': [0, 130],
      'Spitting/Soldier/Arcane Scarabs': [0, 64],
      'Akkha': [0, 640],
      "Akkha's Shadow": [0, 110],
      'Zebak': [0, 930],
      'Obelisk': [0, 420],
      'Wardens P2': [0, 225],
      'Core': [0, 5180],
      'Wardens P3': [0, 1410],
    },
    300: {
      'Ba-Ba': [2, 940],
      'Kephri (shield up)': [1, 360],
      'Kephri (shield down)': [1, 190],
      'Spitting/Soldier/Arcane Scarabs': [1, 95],
      'Akkha': [1, 950],
      "Akkha's Shadow": [1, 165],
      'Zebak': [0, 1280],
      'Obelisk': [0, 570],
      'Wardens P2': [0, 310],
      'Core': [0, 5850],
      'Wardens P3': [0, 1940],
    },
    350: {
      'Ba-Ba': [0, 910],
      'Kephri (shield up)': [1, 390],
      'Kephri (shield down)': [1, 205],
      'Spitting/Soldier/Arcane Scarabs': [1, 105],
      'Akkha': [1, 1040],
      "Akkha's Shadow": [1, 180],
      'Zebak': [2, 1570],
      'Obelisk': [0, 620],
      'Wardens P2': [0, 340],
      'Core': [0, 6080],
      'Wardens P3': [0, 2110],
    },
    405: {
      'Ba-Ba': [3, 1170],
      'Kephri (shield up)': [1, 420],
      'Kephri (shield down)': [1, 225],
      'Spitting/Soldier/Arcane Scarabs': [1, 110],
      'Akkha': [3, 1240],
      "Akkha's Shadow": [3, 215],
      'Zebak': [1, 1640],
      'Obelisk': [0, 680],
      'Wardens P2': [0, 370],
      'Core': [0, 6300],
      'Wardens P3': [0, 2310],
    },
    450: {
      'Ba-Ba': [6, 1420],
      'Kephri (shield up)': [3, 500],
      'Kephri (shield down)': [3, 265],
      'Spitting/Soldier/Arcane Scarabs': [3, 130],
      'Akkha': [4, 1380],
      "Akkha's Shadow": [4, 240],
      'Zebak': [3, 1920],
      'Obelisk': [0, 730],
      'Wardens P2': [0, 390],
      'Core': [0, 6530],
      'Wardens P3': [0, 2460],
    },
    500: {
      'Ba-Ba': [2, 1290],
      'Kephri (shield up)': [3, 530],
      'Kephri (shield down)': [3, 285],
      'Spitting/Soldier/Arcane Scarabs': [3, 140],
      'Akkha': [4, 1480],
      "Akkha's Shadow": [4, 260],
      'Zebak': [3, 2050],
      'Obelisk': [0, 780],
      'Wardens P2': [0, 420],
      'Core': [0, 6750],
      'Wardens P3': [0, 2640],
    },
    540: {
      'Ba-Ba': [2, 1360],
      'Kephri (shield up)': [3, 560],
      'Kephri (shield down)': [3, 295],
      'Spitting/Soldier/Arcane Scarabs': [3, 150],
      'Akkha': [4, 1550],
      "Akkha's Shadow": [4, 270],
      'Zebak': [3, 2160],
      'Obelisk': [0, 820],
      'Wardens P2': [0, 440],
      'Core': [0, 6930],
      'Wardens P3': [0, 2780],
    },
  };
  /* eslint-enable quote-props */

  Object.keys(testData).forEach((raidLevelStr) => describe(`Raid level ${raidLevelStr}`, () => {
    const raidLevel = parseInt(raidLevelStr);
    Object.keys(testData[raidLevel]).forEach((monster) => test(monster, () => {
      const monsterId = MONSTER_IDS[monster];
      const pathLevel = testData[raidLevel][monster][0];
      const expectedHp = testData[raidLevel][monster][1];

      const m = getTestMonsterById(monsterId, {
        inputs: {
          toaInvocationLevel: raidLevel,
          toaPathLevel: pathLevel,
        },
      });
      const scaled = applyToaScaling(m);
      expect(scaled.skills.hp).toBe(expectedHp);
    }));
  }));
});
