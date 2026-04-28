import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { GetPropsCommonOptions, UseSelectGetToggleButtonPropsOptions } from 'downshift';
import Image from 'next/image';
import { parseLoadoutsFromImportedData, useStore } from '@/state';
import RuneLiteLogo from '@/public/img/RuneLite.webp';
import Modal from '@/app/components/generic/Modal';
import LazyImage from '@/app/components/generic/LazyImage';
import Select, { OnIsOpenChangeParams } from '@/app/components/generic/Select';
import { findRuneLiteInstances, WikiSyncer } from '@/wikisync/WikiSyncer';

type WikiSyncSelectItem = {
  label: string;
  syncer?: WikiSyncer;
};

interface IWikiSyncButtonProps {
  getToggleButtonProps: (options?: UseSelectGetToggleButtonPropsOptions | undefined, otherOptions?: GetPropsCommonOptions | undefined) => unknown;
}

const WikiSyncButton: React.FC<IWikiSyncButtonProps> = observer((props) => {
  const { getToggleButtonProps } = props;

  const onButtonClick = useCallback(async () => {
    // simple logging of button press for usage stats
    fetch('https://chisel.weirdgloop.org/t/dps/rl');
  }, []);

  return (
    <>
      {/* eslint-disable react/jsx-props-no-spreading */}
      <button
        {...getToggleButtonProps({
          onClick: onButtonClick,
        }) as object}
        type="button"
        className="transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] p-0.5 rounded-md dark:bg-dark-300 dark:border-dark-200 flex items-center gap-1 w-8"
        data-tooltip-id="tooltip"
        data-tooltip-content="Load data from RuneLite"
      >
        <Image alt="RuneLite" src={RuneLiteLogo} />
      </button>
    </>
  );
});

const WikiSyncButtonWrapper: React.FC = observer(() => {
  const { updatePlayer } = useStore();
  const [helpIsOpen, setHelpIsOpen] = useState(false);
  const [validWikiSyncInstances, setValidWikiSyncInstances] = useState<WikiSyncSelectItem[]>([{ label: 'Loading...' }]);

  const onSelect = useCallback(async (item: WikiSyncSelectItem | null | undefined) => {
    if (item) {
      const data = await item.syncer?.getPlayer();
      if (data) {
        parseLoadoutsFromImportedData(data).forEach((player) => {
          updatePlayer(player);
        });
      }
    }
  }, [updatePlayer]);

  const onIsOpenChange = useCallback(async ({ isOpen, closeMenu }: OnIsOpenChangeParams) => {
    if (!isOpen) {
      // We should close the connections to WikiSync, but we need to wait a bit for the current player loadout to be fetched.
      setTimeout(() => {
        for (const validWikiSyncInstance of validWikiSyncInstances) {
          validWikiSyncInstance.syncer?.close();
        }
      }, 2000);
    } else {
      setValidWikiSyncInstances([{ label: 'Loading...' }]);
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
        CustomSelectComponent={WikiSyncButton}
        onSelectedItemChange={onSelect}
        onIsOpenChange={onIsOpenChange}
        resetAfterSelect
      />
      <Modal
        isOpen={helpIsOpen}
        setIsOpen={setHelpIsOpen}
        title="Load data from RuneLite"
        footerChildren={(
          <p className="text-xs text-gray-300">
            You can also open this page from RuneLite without WikiSync. Ensure the default Wiki plugin is enabled,
            then right-click the Wiki icon under the minimap and click DPS Wiki.
          </p>
            )}
      >
        <div className="flex gap-4">
          <div>
            <LazyImage src={RuneLiteLogo.src} width={100} />
          </div>
          <div className="text-sm">
            <p>
              We can load your current character data directly from RuneLite!
            </p>
            <ol className="mt-2 list-decimal list-inside text-orange-200">
              <li>Open the RuneLite client</li>
              <li>
                Install the
                {' '}
                <a href="https://oldschool.runescape.wiki/w/RuneScape:WikiSync" target="blank">WikiSync plugin</a>
                {' '}
                & turn it on
              </li>
              <li>Login to Old School RuneScape</li>
            </ol>
            <p className="mt-2">
              The calculator will automatically detect RuneLite running on this computer. Once RuneLite is detected, click the RuneLite
              button to import your current player.
            </p>
            <p className="mt-2 text-orange-200">
              Not working?
              {' '}
              <a href="https://oldschool.runescape.wiki/w/RS:WSHELP">Click here</a>
              {' '}
              for troubleshooting steps.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default WikiSyncButtonWrapper;
