import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { parseLoadoutsFromImportedData, useStore } from '@/state';
import RuneLiteLogo from '@/public/img/RuneLite.webp';
import Modal from '@/app/components/generic/Modal';
import LazyImage from '@/app/components/generic/LazyImage';
import {
  GetPropsCommonOptions,
  UseSelectGetToggleButtonPropsOptions,
} from 'downshift';
import Select from '@/app/components/generic/Select';

type WikiSyncSelectItem = {
  label: string;
  value: number;
};

interface IWikiSyncButtonProps {
  getToggleButtonProps: (options?: UseSelectGetToggleButtonPropsOptions | undefined, otherOptions?: GetPropsCommonOptions | undefined) => unknown;
}

const WikiSyncButton: React.FC<IWikiSyncButtonProps> = observer((props) => {
  const { getToggleButtonProps } = props;
  const store = useStore();
  const { validWikiSyncInstances } = store;
  const [helpIsOpen, setHelpIsOpen] = useState(false);

  const onButtonClick = useCallback(() => {
    if (validWikiSyncInstances.size === 0) {
      setHelpIsOpen(true);
    }
  }, [validWikiSyncInstances]);

  useEffect(() => {
    // If we get a valid WikiSync instance at any point, then we should close the help UI.
    if (validWikiSyncInstances.size > 0 && helpIsOpen) {
      setHelpIsOpen(false);
    }
  }, [helpIsOpen, validWikiSyncInstances]);

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
        <img alt="RuneLite" src={RuneLiteLogo.src} className={validWikiSyncInstances.size === 0 ? 'grayscale' : ''} />
      </button>
      <Modal
        isOpen={helpIsOpen}
        setIsOpen={setHelpIsOpen}
        title="Load data from RuneLite"
        footerChildren={(
          <p className="text-xs text-gray-300">
            You can also open this page from RuneLite without WikiSync. Ensure the default Wiki plugin is enabled,
            then right-click the Wiki icon under the minimap and click View DPS.
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
              The calculator will detect your PC running RuneLite, allowing you to click the RuneLite
              button again to import your current player.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
});

const WikiSyncButtonWrapper: React.FC = () => {
  const store = useStore();
  const {
    validWikiSyncInstances, updatePlayer,
  } = store;
  const items: WikiSyncSelectItem[] = [...validWikiSyncInstances].map(([port, ins]) => ({ label: ins.username!, value: port }));

  const onSelect = useCallback(async (item: WikiSyncSelectItem | null | undefined) => {
    if (item) {
      const data = await validWikiSyncInstances.get(item.value)?.getPlayer();
      if (data) {
        parseLoadoutsFromImportedData(data).forEach((player) => {
          updatePlayer(player);
        });
      }
    }
  }, [validWikiSyncInstances, updatePlayer]);

  return (
    <Select
      id="wikisync-wss"
      items={items}
      CustomSelectComponent={WikiSyncButton}
      onSelectedItemChange={onSelect}
    />
  );
};

export default WikiSyncButtonWrapper;
