import { getMonsters, INITIAL_MONSTER_INPUTS } from '@/lib/Monsters';
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
      inputs: INITIAL_MONSTER_INPUTS,
    });
    const computedMaxHit = calc.getNPCMaxHit();
    if (wikiMaxHit !== computedMaxHit) {
      mismatch[m.style || ''].push(`${m.name}${m.version ? `#${m.version}` : ''}`);
    }
  }

  console.log(JSON.stringify(mismatch, null, 2));
};

export default generateMaxHitDiscrepancies;
