import React, { useState } from 'react';
import Modal from '@/app/components/generic/Modal';
import LazyImage from '@/app/components/generic/LazyImage';
import RuneLiteLogo from '@/public/img/RuneLite.webp';

interface WikiSyncHelpModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const WikiSyncHelpModal: React.FC<WikiSyncHelpModalProps> = ({ isOpen, setIsOpen }) => {
  const [localNetworkPermission, setLocalNetworkPermission] = useState<PermissionState | null>(null);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={(
        <div className="flex gap-2 items-center">
          <LazyImage src={RuneLiteLogo.src} width={25} />
          Load data from RuneLite
        </div>
      )}
      onOpen={() => {
        navigator.permissions.query({ name: 'loopback-network' } as unknown as PermissionDescriptor)
          .then((result) => {
            setLocalNetworkPermission(result.state);
          })
          .catch(() => {
            // Likely an old browser version or unsupported browser (Safari?) which doesn't require this permission
            setLocalNetworkPermission(null);
          });
      }}
      footerChildren={(
        <p className="text-xs text-gray-300">
          You can also open this page from RuneLite without WikiSync. Ensure the default Wiki plugin is enabled,
          then right-click the Wiki icon under the minimap and click DPS Wiki.
        </p>
      )}
    >
      {localNetworkPermission === 'prompt' && (
        <div className="border mb-2 p-2 text-sm bg-orange-400 border-orange-300">
          Your browser may prompt you to give permission to access local apps on your device. This is required for us
          to communicate with RuneLite.
        </div>
      )}
      {localNetworkPermission === 'denied' && (
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
  );
};

export default WikiSyncHelpModal;
