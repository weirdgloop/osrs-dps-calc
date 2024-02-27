'use client';

import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import Select from '../generic/Select';

type WikiSyncSelectItem = {
  label: string;
  value: number;
};

const WikiSyncAddLoadout: React.FC = observer(() => {
  const store = useStore();
  const {
    createLoadout, rlUsernames, updatePlayer,
  } = store;

  const wikiSyncSelectItems: WikiSyncSelectItem[] = [];

  rlUsernames.forEach((wikisyncer, port) => {
    if (wikisyncer.username) {
      wikiSyncSelectItems.push({ label: wikisyncer.username, value: port });
    }
  });

  const onSelect = useCallback(async (item: WikiSyncSelectItem | null | undefined) => {
    console.log(item);
    if (item) {
      const data = await rlUsernames.get(item.value)?.getPlayer();
      data?.loadouts.forEach((player) => {
        createLoadout(true);
        updatePlayer(player);
      });
    }
  }, [createLoadout, rlUsernames, updatePlayer]);

  if (wikiSyncSelectItems.length === 0) {
    return <div>No RL account logged in</div>;
  }

  return (
    <Select<WikiSyncSelectItem>
      id="rlws"
      items={wikiSyncSelectItems}
      placeholder="RL"
      resetAfterSelect
      onSelectedItemChange={onSelect}
    />
  );
});

export default WikiSyncAddLoadout;
