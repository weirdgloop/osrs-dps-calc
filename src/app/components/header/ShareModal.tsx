import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { IconClipboardCopy, IconExternalLink } from '@tabler/icons-react';
import Modal from '@/app/components/generic/Modal';
import { useStore } from '@/state/RootStore';
import { useUI } from '@/state/UIStore';
import { generateShortlink } from '@/utils';

const domain = process.env.NEXT_PUBLIC_SHORTLINK_URL;

interface ShareModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ShareModal: React.FC<ShareModalProps> = observer(({ isOpen, setIsOpen }) => {
  const root = useStore();
  const { debug } = useUI();
  const inputRef = useRef<HTMLInputElement>(null);

  const [shareId, setShareId] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    async function generate() {
      setShareId('');
      setError(false);
      try {
        setShareId(await generateShortlink(root.snapshot));
      } catch (e) {
        setError(true);
      }
    }

    if (isOpen) {
      generate();
    }
  }, [isOpen, root]);

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
          {debug && (
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

export default ShareModal;
