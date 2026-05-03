import { IconClipboardCopy, IconExternalLink, IconShare2 } from '@tabler/icons-react';
import React, { createRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { generateShortlink } from '@/utils';
import Modal from '@/app/components/generic/Modal';
import { toast } from 'react-toastify';
import { useDebugState } from '@/state/DebugStore';

interface ShareModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}

const ShareModal: React.FC<ShareModalProps> = observer(({ isOpen, setIsOpen }) => {
  const { isDebug } = useDebugState();
  const store = useStore();
  const inputRef = createRef<HTMLInputElement>();

  const domain = process.env.NEXT_PUBLIC_SHORTLINK_URL;
  const [shareId, setShareId] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    async function generate() {
      setShareId('');
      setError(false);
      try {
        setShareId(await generateShortlink(store.asImportableData));
      } catch (e) {
        setError(true);
      }
    }

    if (isOpen) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Share"
    >
      <div className="text-sm">
        <p>You can share your current calculator state (loadouts and selected monster) with friends by sending them the link below.</p>
        <div className="mt-2 flex gap-1">
          <input ref={inputRef} readOnly className="form-control w-full" value={shareId ? `${domain}?id=${shareId}` : 'Generating...'} />
          <button
            className="form-control flex items-center gap-1 hover:scale-105"
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(inputRef.current?.value as string).then(() => {
                toast('Copied share link to clipboard!', { toastId: 'share' });
              }).catch(() => {});
            }}
          >
            <IconClipboardCopy className="w-5" />
            Copy
          </button>
          {isDebug && (
            <a
              className="form-control flex items-center gap-1 hover:scale-105 no-underline"
              type="button"
              href={`https://dps.osrs.wiki?id=${shareId}`}
              target="_blank"
            >
              <IconExternalLink className="w-5" />
              Prod
            </a>
          )}
        </div>
        {error && (
          <p className="mt-2 text-red-400 dark:text-red-200">
            There was a problem generating a share link. Please try again.
          </p>
        )}
      </div>
    </Modal>
  );
});

const ShareLoadoutButton: React.FC = observer(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] py-1.5 px-2.5 rounded-md dark:bg-dark-300 dark:border-dark-200 flex items-center gap-1"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <IconShare2 size={20} aria-label="Share loadout" />
        <div className="hidden md:block">Share loadout</div>
      </button>
      <ShareModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
});
export default ShareLoadoutButton;
