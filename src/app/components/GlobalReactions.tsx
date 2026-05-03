import React from 'react';
import useReaction from '@/state/UseReaction';
import { usePreferences } from '@/state/Preferences';
import { autorun } from 'mobx';
import { useLoadouts } from '@/state/PlayerLoadouts';
import { useMonster } from '@/state/MonsterStore';

const GlobalReactions: React.FC = () => {
  const { preferences } = usePreferences();
  const { monster, isCustomMonster, loadMonster } = useMonster();
  const { loadouts } = useLoadouts();

  // this is the big mama calculate-everything thing
  autorun(() => {

  });

  // when manual mode is disabled, recalculate the player's equipment bonuses
  useReaction(
    () => preferences.manualMode,
    () => {
      if (!preferences.manualMode) {
        loadouts.forEach((ps) => {
          ps.recalculateEquipmentBonuses();
        });
      }
    },
  );

  // when manual mode is disabled, and the current monster is not custom, reload the monster's stats from db
  useReaction(
    () => preferences.manualMode,
    () => {
      if (!preferences.manualMode && !isCustomMonster) {
        loadMonster(monster.id);
      }
    },
  );

  return null;
};

export default GlobalReactions;
