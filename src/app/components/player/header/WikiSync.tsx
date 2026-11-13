import React, { useCallback, useState } from 'react';
import Select, { OnIsOpenChangeParams } from '@/app/components/generic/Select';
import WikiSyncToggleButton from '@/app/components/player/header/WikiSyncToggleButton';
import WikiSyncHelpModal from '@/app/components/player/header/WikiSyncHelpModal';
import { usePlayer } from '@/state/PlayerStore';
import { toPlayerPatch } from '@/state/serialization';
import { findRuneLiteInstances, WikiSyncer } from '@/wikisync/WikiSyncer';

type WikiSyncSelectItem = {
  label: string;
  syncer?: WikiSyncer;
};

const SEARCHING: WikiSyncSelectItem[] = [{ label: 'Searching for RuneLite...' }];

const WikiSync: React.FC = () => {
  const player = usePlayer();
  const [helpIsOpen, setHelpIsOpen] = useState(false);
  const [validWikiSyncInstances, setValidWikiSyncInstances] = useState<WikiSyncSelectItem[]>(SEARCHING);

  const onSelect = async (item: WikiSyncSelectItem | null | undefined) => {
    const data = await item?.syncer?.getPlayer();
    if (data) {
      data.loadouts.map(toPlayerPatch).forEach((patch) => player.update(patch));
    }
  };

  const onIsOpenChange = useCallback(async ({ isOpen, closeMenu }: OnIsOpenChangeParams) => {
    if (!isOpen) {
      // We should close the connections to WikiSync, but we need to wait a bit for the current player loadout to be fetched.
      setTimeout(() => {
        for (const validWikiSyncInstance of validWikiSyncInstances) {
          validWikiSyncInstance.syncer?.close();
        }
      }, 2000);
    } else {
      setValidWikiSyncInstances(SEARCHING);
      const syncers = (await findRuneLiteInstances()).map((syncer) => ({
        label: syncer.username!,
        syncer,
      }));

      if (syncers.length === 0) {
        setHelpIsOpen(true);
        closeMenu();
      } else {
        setValidWikiSyncInstances(syncers);
      }
    }
  }, [validWikiSyncInstances]);

  return (
    <>
      <Select
        id="wikisync-wss"
        items={validWikiSyncInstances}
        CustomSelectComponent={WikiSyncToggleButton}
        onSelectedItemChange={onSelect}
        onIsOpenChange={onIsOpenChange}
        resetAfterSelect
      />
      <WikiSyncHelpModal isOpen={helpIsOpen} setIsOpen={setHelpIsOpen} />
    </>
  );
};

export default WikiSync;
