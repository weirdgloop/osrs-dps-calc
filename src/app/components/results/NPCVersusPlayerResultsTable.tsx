import React from 'react';
import LoadoutColumnHeaders from '@/app/components/results/table/LoadoutColumnHeaders';
import NPCVersusPlayerResultRow from '@/app/components/results/npcVsPlayer/NPCVersusPlayerResultRow';

const NPCVersusPlayerResultsTable: React.FC = () => (
  <table>
    <LoadoutColumnHeaders />
    <tbody>
      <NPCVersusPlayerResultRow calcKey="npcMaxHit" title="The maximum hit that the NPC will do to you">
        NPC max hit
      </NPCVersusPlayerResultRow>
      <NPCVersusPlayerResultRow calcKey="npcDps" title="The average damage the NPC will deal per-second">
        Damage taken per sec
      </NPCVersusPlayerResultRow>
      <NPCVersusPlayerResultRow calcKey="avgDmgTaken" title="The average damage you will receive from this NPC, per kill">
        Avg. damage taken per kill
      </NPCVersusPlayerResultRow>
      <NPCVersusPlayerResultRow calcKey="npcMaxAttackRoll" title="The maximum attack roll for the NPC (lower is better!)">
        NPC attack roll
      </NPCVersusPlayerResultRow>
      <NPCVersusPlayerResultRow calcKey="playerDefRoll" title="The player's defense roll (higher is better!)">
        Player def roll
      </NPCVersusPlayerResultRow>
      <NPCVersusPlayerResultRow calcKey="npcAccuracy" title="How accurate the NPC is against you">
        NPC accuracy
      </NPCVersusPlayerResultRow>
    </tbody>
  </table>
);

export default NPCVersusPlayerResultsTable;
