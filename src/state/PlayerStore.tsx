import React, { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import { createDefaultPlayer, Player } from '@/types/Player';
import { MERGE_OVERWRITE_ARRAYS } from '@/utils';

export class PlayerStore {
  private static SELF_ID: number = 0;

  uid: number;

  player: Player;

  constructor(name?: string) {
    makeAutoObservable(this, { uid: false }, { autoBind: true });

    this.player = createDefaultPlayer(name);
    this.uid = PlayerStore.SELF_ID;
    PlayerStore.SELF_ID += 1;
  }

  public update(newValues: PartialDeep<Player>) {
    this.player = merge(this.player, newValues, MERGE_OVERWRITE_ARRAYS);
  }

  recalculateEquipmentBonuses() {
    // todo
  }
}

export const PlayerContext = createContext<PlayerStore>({} as PlayerStore);

export const PlayerProvider: React.FC<{ value: PlayerStore, children: React.ReactNode }> = ({ value, children }) => (
  <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
);

export const usePlayer = () => useContext(PlayerContext);
