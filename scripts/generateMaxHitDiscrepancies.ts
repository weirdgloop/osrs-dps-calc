import { getMonsters } from '@/lib/Monsters';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { generateEmptyPlayer } from '@/state';

const monsters = getMonsters();

/**
 * Using each NPC's max hit provided by the wiki, generate a list of discrepancies between the wiki max hit value
 * and the value that we compute using the NPC vs Player calculator.
 */
const generateMaxHitDiscrepancies = () => {
  const mismatch: { [s: string]: string[] } = {
    '': [],
    slash: [],
    crush: [],
    stab: [],
    magic: [],
    ranged: [],
  };
  for (const m of monsters) {
    // if (m.style !== 'magic') continue;
    const wikiMaxHit = m.maxHit;
    if (wikiMaxHit === undefined) continue;
    if (!['slash', 'crush', 'stab', 'magic', 'ranged'].includes(m.style || '')) continue;

    const calc = new NPCVsPlayerCalc(generateEmptyPlayer(), {
      ...m,
      inputs: {
        isFromCoxCm: false,
        toaInvocationLevel: 0,
        toaPathLevel: 0,
        partyMaxCombatLevel: 126,
        partyAvgMiningLevel: 99,
        partyMaxHpLevel: 99,
        partySize: 1,
        monsterCurrentHp: 150,
        defenceReductions: {
          vulnerability: false,
          accursed: false,
          elderMaul: 0,
          dwh: 0,
          emberlight: 0,
          arclight: 0,
          bgs: 0,
          tonalztic: 0,
        },
      },
    });
    const computedMaxHit = calc.getNPCMaxHit();
    if (wikiMaxHit !== computedMaxHit) {
      mismatch[m.style || ''].push(`${m.name}${m.version ? `#${m.version}` : ''}`);
    }
  }

  console.log(JSON.stringify(mismatch, null, 2));
};

export default generateMaxHitDiscrepancies;
