import React, {useState} from 'react';
import {Dialog, Switch} from '@headlessui/react';
import {classNames} from '../utils';
import Toggle from '@/components/generic/Toggle';

const PreferencesModal: React.FC = () => {
  let [isOpen, setIsOpen] = useState(true);
  const [enabled, setEnabled] = useState(false);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className={'fixed inset-0 flex items-center justify-center p-4'}>
        <Dialog.Panel className={'w-full max-w-lg rounded-xl bg-darker-900 text-white'}>
          <Dialog.Title className={'font-mono text-xl p-4 bg-darker-800 rounded-t-xl text-center font-extrabold'}>
            Preferences
          </Dialog.Title>
          <div className={'p-4 max-w-xl mt-2 mx-auto'}>
            <h2 className={'font-mono mb-2'}>Persistence</h2>
            <Toggle checked={enabled} setChecked={setEnabled} label={'Remember username across sessions'} />
            <Toggle checked={enabled} setChecked={setEnabled} label={'Remember player stats across sessions'} />
            <Toggle checked={enabled} setChecked={setEnabled} label={'Remember monster stats across sessions'} />
            <h2 className={'font-mono mt-6 mb-2'}>Share</h2>
            <p className={'text-sm'}>
              You can share a link to your current configuration with other people, or bookmark it for the future.{' '}
              <button className={'text-dracula hover:text-dracula-200 underline decoration-dotted'}>
                Click here to copy a link to this configuration
              </button>{'.'}
            </p>
          </div>
          <div className={'mt-6 p-4 border-t border-darker-600 flex justify-between'}>
            <button
              className={classNames(
                'text-white bg-gray-700 hover:bg-gray-600 hover:text-white',
                'px-3 py-2 rounded-md text-sm font-medium'
              )}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className={classNames(
                'text-black bg-dracula hover:bg-dracula-200',
                'ml-2 px-3 py-2 rounded-md text-sm font-medium'
              )}

              onClick={() => setIsOpen(false)}
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default PreferencesModal;