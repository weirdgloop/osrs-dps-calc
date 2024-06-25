import React, { useState } from 'react';
import { IconBrandGithub } from '@tabler/icons-react';
import Modal from '@/app/components/generic/Modal';
import LazyImage from '@/app/components/generic/LazyImage';
import power from '@/public/img/misc/power.webp';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';

const Footer: React.FC = observer(() => {
  const store = useStore();
  const { manualMode } = store.prefs;
  const [manualIsOpen, setManualIsOpen] = useState(false);
  return (
    <div
      className="border-t-8 border-body-500 dark:border-dark-300 py-4 px-4 items-center text-xs bg-btns-400 dark:bg-dark-500 text-body-300 dark:text-gray-300"
    >
      <div className="max-w-7xl mx-auto flex gap-4 justify-between flex-wrap">
        <div className="flex gap-2 items-center">
          <div>
            &copy;
            {' '}
            {new Date().getFullYear()}
            {' '}
            <a href="https://weirdgloop.org" target="_blank">Weird Gloop</a>
          </div>
          <a
            className="flex border rounded-full p-0.5 border-gray-400"
            href="https://github.com/weirdgloop/osrs-dps-calc"
            target="_blank"
            aria-label="Visit the GitHub repo"
          >
            <IconBrandGithub size={15} />
          </a>
          {process.env.GIT_SHA && (
            <a href={`https://github.com/weirdgloop/osrs-dps-calc/tree/${process.env.GIT_SHA}`} target="_blank">
              {`${process.env.GIT_SHA_SHORT}${process.env.GIT_DIRTY === 'true' ? '*' : ''}`}
            </a>
          )}
        </div>
        <div>
          <button
            type="button"
            className="underline"
            onClick={() => {
              if (manualMode) {
                store.updatePreferences({ manualMode: false });
              } else {
                setManualIsOpen(true);
              }
            }}
          >
            {manualMode ? 'Disable' : 'Enable'}
            {' '}
            manual mode
          </button>
          {' '}
          &#183;
          {' '}
          <a href="https://weirdgloop.org/privacy" target="_blank">Privacy</a>
          {' '}
          &#183;
          {' '}
          <a href="https://weirdgloop.org/terms" target="_blank">Terms</a>
          {' '}
          &#183;
          {' '}
          <a href="https://oldschool.runescape.wiki" target="_blank">OSRS Wiki</a>
        </div>
      </div>
      <Modal
        isOpen={manualIsOpen}
        setIsOpen={setManualIsOpen}
        title="Manual mode"
        hideCloseButton
        footerChildren={(
          <>
            <button
              type="button"
              className="btn text-sm"
              onClick={() => setManualIsOpen(false)}
            >
              No, keep disabled
            </button>
            <button
              type="button"
              className="btn text-sm"
              onClick={() => {
                store.updatePreferences({ manualMode: true });
                setManualIsOpen(false);
              }}
            >
              Enable manual mode
            </button>
          </>
        )}
      >
        <div className="flex gap-4">
          <div>
            <LazyImage src={power.src} width={100} />
          </div>
          <div className="text-sm">
            <p>
              Manual mode allows you to edit various player stats and equipment bonuses manually.
              This is
              {' '}
              <strong>likely</strong>
              {' '}
              to cause the calculator to exhibit unexpected behaviour.
              We recommend keeping it off if you don&apos;t know what you&apos;re doing.
            </p>
            <p className="mt-2">Are you sure you want to turn this on?</p>
          </div>
        </div>
      </Modal>

    </div>
  );
});

export default Footer;
