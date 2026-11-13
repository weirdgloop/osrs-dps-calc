import React from 'react';
import { observer } from 'mobx-react-lite';
import RootStore, { RootStoreContext } from '@/state/RootStore';
import { PreferencesContext } from '@/state/PreferencesStore';
import { UIContext } from '@/state/UIStore';
import { MonsterContext } from '@/state/MonsterStore';
import { LoadoutContext } from '@/state/LoadoutStore';
import { PlayerContext } from '@/state/PlayerStore';
import { CalcStoreContext } from '@/state/CalcStore';

const RootStoreProvider: React.FC<{ store: RootStore, children: React.ReactNode }> = observer(({ store, children }) => (
  <RootStoreContext.Provider value={store}>
    <PreferencesContext.Provider value={store.preferences}>
      <UIContext.Provider value={store.ui}>
        <MonsterContext.Provider value={store.monster}>
          <LoadoutContext.Provider value={store.loadouts}>
            <PlayerContext.Provider value={store.loadouts.currentLoadout}>
              <CalcStoreContext.Provider value={store.calc}>
                {children}
              </CalcStoreContext.Provider>
            </PlayerContext.Provider>
          </LoadoutContext.Provider>
        </MonsterContext.Provider>
      </UIContext.Provider>
    </PreferencesContext.Provider>
  </RootStoreContext.Provider>
));

export default RootStoreProvider;
