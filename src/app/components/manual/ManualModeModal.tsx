import React from 'react';
import Modal from '@/app/components/generic/Modal';
import LazyImage from '@/app/components/generic/LazyImage';
import power from '@/public/img/misc/power.webp';
import { usePreferences } from '@/state/PreferencesStore';

interface ManualModeModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ManualModeModal: React.FC<ManualModeModalProps> = ({ isOpen, setIsOpen }) => {
  const preferences = usePreferences();

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Manual mode"
      hideCloseButton
      footerChildren={(
        <>
          <button
            type="button"
            className="btn text-sm"
            onClick={() => setIsOpen(false)}
          >
            No, keep disabled
          </button>
          <button
            type="button"
            className="btn text-sm"
            onClick={() => {
              preferences.update({ manualMode: true });
              setIsOpen(false);
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
  );
};

export default ManualModeModal;
