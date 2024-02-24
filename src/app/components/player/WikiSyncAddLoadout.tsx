import React, { useCallback, useMemo } from 'react';
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
    rlUsernames,
  } = store;

  const wikiSyncSelectItems: WikiSyncSelectItem[] = useMemo(() => {
    const items: WikiSyncSelectItem[] = [];
    rlUsernames.forEach((wikisyncer, port) => {
      if (wikisyncer.username) {
        items.push({ label: wikisyncer.username, value: port });
      }
    });
    return items;
  }, [rlUsernames]);

  Array.from(
    rlUsernames.entries(),
    ([port, wikisyncer]) => ({ label: wikisyncer.username, value: port }),
  ).filter(({ label }) => label);

  const onSelect = useCallback((item: WikiSyncSelectItem | null | undefined) => {
    console.log(item);
  }, []);

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
