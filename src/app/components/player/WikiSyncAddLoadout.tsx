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
    rlUsernames,
  } = store;

  const rlwss: WikiSyncSelectItem[] = Array.from(
    rlUsernames.entries(),
    ([port, wikisyncer]) => ({ label: wikisyncer.username, value: port }),
  ).filter(({ label }) => label);

  const onSelect = useCallback((item: WikiSyncSelectItem | null | undefined) => {
    console.log(item);
  }, []);

  if (rlwss.length === 0) {
    return <div>No RL account logged in</div>;
  }

  return (
    <Select<WikiSyncSelectItem>
      id="rlws"
      items={rlwss}
      placeholder="RL"
      resetAfterSelect
      onSelectedItemChange={onSelect}
    />
  );
});

export default WikiSyncAddLoadout;
