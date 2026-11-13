import React from 'react';
import { observer } from 'mobx-react-lite';
import LoadoutColumnHeaders from '@/app/components/results/table/LoadoutColumnHeaders';
import PlayerVsNPCResultRow from '@/app/components/results/playerVsNpc/PlayerVsNPCResultRow';
import { usePreferences } from '@/state/PreferencesStore';

const GroupHeader: React.FC<{ title: string }> = ({ title }) => (
  <tr>
    <th
      className="t-group-header"
      colSpan={999}
    >
      {title}
    </th>
  </tr>
);

const PlayerVsNPCResultsTable: React.FC = observer(() => {
  const { resultsExpanded } = usePreferences();

  return (
    <table>
      <LoadoutColumnHeaders focusable />
      <tbody>
        <PlayerVsNPCResultRow calcKey="maxHit" title="The maximum hit that you will deal to the monster">
          Max hit
        </PlayerVsNPCResultRow>
        {resultsExpanded && (
          <PlayerVsNPCResultRow calcKey="expectedHit" title="The average damage per attack, including misses.">
            Expected hit
          </PlayerVsNPCResultRow>
        )}
        <PlayerVsNPCResultRow calcKey="dps" title="The average damage you will deal per-second">
          DPS
        </PlayerVsNPCResultRow>
        <PlayerVsNPCResultRow calcKey="ttk" title="The average time (in seconds) it will take to defeat the monster">
          Avg. TTK
        </PlayerVsNPCResultRow>
        <PlayerVsNPCResultRow calcKey="accuracy" title="How accurate you are against the monster">
          Accuracy
        </PlayerVsNPCResultRow>
        {!resultsExpanded && (
          <PlayerVsNPCResultRow calcKey="specExpected" title="The expected hit that the special attack will deal to the monster per use, including misses" collapseSpecs={resultsExpanded}>
            Spec expected hit
          </PlayerVsNPCResultRow>
        )}
        {resultsExpanded && (
          <>
            <GroupHeader title="Rolls" />
            <PlayerVsNPCResultRow calcKey="maxAttackRoll" title="The maximum attack roll based on your current gear (higher is better!)">
              Attack roll
            </PlayerVsNPCResultRow>
            <PlayerVsNPCResultRow calcKey="npcDefRoll" title="The NPC's defense roll (lower is better!)">
              NPC def roll
            </PlayerVsNPCResultRow>
            <GroupHeader title="Special attack" />
            <PlayerVsNPCResultRow calcKey="specAccuracy" title="How accurate your special attack is against the monster" collapseSpecs={resultsExpanded}>
              Accuracy
            </PlayerVsNPCResultRow>
            <PlayerVsNPCResultRow calcKey="specMomentDps" title="The average damage you would deal per-second, given infinite special attack energy" collapseSpecs={resultsExpanded}>
              DPS
            </PlayerVsNPCResultRow>
            <PlayerVsNPCResultRow calcKey="specFullDps" title="The damage per-second of the special attack, accounting for special attack regeneration" collapseSpecs={resultsExpanded}>
              Spec-only DPS
            </PlayerVsNPCResultRow>
            <PlayerVsNPCResultRow calcKey="specMaxHit" title="The maximum hit that the special attack can deal to the monster" collapseSpecs={resultsExpanded}>
              Max hit
            </PlayerVsNPCResultRow>
            <PlayerVsNPCResultRow calcKey="specExpected" title="The expected hit that the special attack will deal to the monster per use, including misses" collapseSpecs={resultsExpanded}>
              Expected hit
            </PlayerVsNPCResultRow>
          </>
        )}
      </tbody>
    </table>
  );
});

export default PlayerVsNPCResultsTable;
