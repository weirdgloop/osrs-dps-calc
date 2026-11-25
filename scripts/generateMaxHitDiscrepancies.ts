import { getMonsters, INITIAL_MONSTER_INPUTS } from '@/lib/Monsters';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { createEmptyPlayer } from '@/state/PlayerStore';
import { MonsterCombatStyles } from '@/types/Monster';

const monsters = getMonsters();

/**
 * Using each NPC's max hit provided by the wiki, generate a list of discrepancies between the wiki max hit value
 * and the value that we compute using the NPC vs Player calculator.
 */
const generateMaxHitDiscrepancies = () => {
  const mismatch: { [s: string]: string[] } = {
    '': [],
    ...Object.fromEntries(MonsterCombatStyles.map((s) => [s, []])),
  };
  for (const m of monsters) {
    // if (m.style !== 'magic') continue;
    const wikiMaxHit = m.maxHit;
    if (wikiMaxHit === undefined) continue;
    if (!m.style || !MonsterCombatStyles.includes(m.style)) continue;

    const calc = new NPCVsPlayerCalc(createEmptyPlayer(), {
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
