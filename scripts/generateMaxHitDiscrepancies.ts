import getMonsters from '@/lib/Monsters';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { generateEmptyPlayer } from '@/state';

const monsters = getMonsters();

/**
 * Using each NPC's max hit provided by the wiki, generate a list of discrepancies between the wiki max hit value
 * and the value that we compute using the NPC vs Player calculator.
 */
const generateMaxHitDiscrepancies = () => {
  for (const m of monsters) {
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
          dwh: 0,
          arclight: 0,
          bgs: 0,
        },
      },
    });
    const computedMaxHit = calc.getNPCMaxHit();
    if (wikiMaxHit !== computedMaxHit) {
      console.log(`${m.name} (${m.id}) has mismatch. Wiki value: ${wikiMaxHit}. Computed value: ${computedMaxHit}`);
    }
  }
};

export default generateMaxHitDiscrepancies;
