import React from 'react';
import { useReaction } from '@/state/UseReaction';
import { usePreferences } from '@/state/Preferences';
import { useMonster } from '@/state/MonsterStore';

const GlobalReactions: React.FC = () => {
  const { manualMode } = usePreferences();
  const { monsterBase, isCustomMonster, loadMonster } = useMonster();

  // when manual mode is disabled, and the current monster is not custom, reload the monster's stats from db
  useReaction(
    () => manualMode,
    () => {
      if (!manualMode && !isCustomMonster) {
        loadMonster(monsterBase.id);
      }
    },
  );

  return null;
};

export default GlobalReactions;
