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
  const [helpLocalNetworkPermission, setHelpLocalNetworkPermission] = useState<PermissionState | null>(null);
  const [validWikiSyncInstances, setValidWikiSyncInstances] = useState<WikiSyncSelectItem[]>([{ label: 'Searching for RuneLite...' }]);

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
      setValidWikiSyncInstances([{ label: 'Searching for RuneLite...' }]);
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
        title={(
          <div className="flex gap-2 items-center">
            <LazyImage src={RuneLiteLogo.src} width={25} />
            Load data from RuneLite
          </div>
        )}
        onOpen={() => {
          // Not recognised as a valid type in this version of TS
          navigator.permissions.query({ name: 'loopback-network' } as unknown as PermissionDescriptor)
            .then((result) => {
              setHelpLocalNetworkPermission(result.state);
            })
            .catch(() => {
              // Likely an old browser version or unsupported browser (Safari?) which doesn't require this permission
              setHelpLocalNetworkPermission(null);
            });
        }}
        footerChildren={(
          <p className="text-xs text-gray-300">
            You can also open this page from RuneLite without WikiSync. Ensure the default Wiki plugin is enabled,
            then right-click the Wiki icon under the minimap and click DPS Wiki.
          </p>
            )}
      >
        {helpLocalNetworkPermission === 'prompt' && (
          <div className="border mb-2 p-2 text-sm bg-orange-400 border-orange-300">
            Your browser may prompt you to give permission to access local apps on your device. This is required for us
            to communicate with RuneLite.
          </div>
        )}
        {helpLocalNetworkPermission === 'denied' && (
          <div className="border mb-2 p-2 text-sm bg-red-400 border-red-300">
            Your browser has blocked access to RuneLite. Please grant access to local apps in your browser settings.
            For help:
            {' '}
            <a href="https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform%3DDesktop&oco=0" target="_blank">Chrome</a>
            ,
            {' '}
            <a href="https://support.mozilla.org/en-US/kb/control-personal-device-local-network-permissions-firefox" target="_blank">Firefox</a>
            ,
            {' '}
            <a href="https://support.brave.app/hc/en-us/articles/360023646212-How-do-I-configure-global-and-site-specific-Shields-settings" target="_blank">Brave</a>
          </div>
        )}
        <div className="text-sm">
          <p>
            If you are logged in to your character on RuneLite, we can fetch your data when you click this button.
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
            <li>Try closing this popup and clicking the button again</li>
          </ol>
          <p className="mt-2">
            Still not working?
            {' '}
            <a href="https://oldschool.runescape.wiki/w/RS:WSHELP">Click here</a>
            {' '}
            for troubleshooting steps.
          </p>
        </div>
      </Modal>
    </>
  );
});

export default WikiSyncButtonWrapper;
