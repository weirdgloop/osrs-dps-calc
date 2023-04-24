import React, {useState} from 'react';
import {Dialog, Switch} from '@headlessui/react';
import {classNames} from '../utils';
import Toggle from '@/components/generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '../state/state';

const PreferencesModal: React.FC = observer(() => {
  const store = useStore();
  const {ui, prefs} = store;

  const isOpen = ui.showPreferencesModal;
  const setIsOpen = (open: boolean) => {
    store.updateUIState({showPreferencesModal: open});
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
      <div className={'fixed inset-0 flex items-center justify-center p-4'}>
        <Dialog.Panel className={'w-full max-w-lg rounded-xl bg-darker-900 text-white'}>
          <Dialog.Title className={'font-serif text-xl p-4 bg-darker-800 rounded-t-xl text-center font-extrabold'}>
            Preferences
          </Dialog.Title>
          <div className={'p-4 max-w-xl mt-2 mx-auto'}>
            <h2 className={'font-serif mb-2'}>Interface</h2>
            <Toggle checked={prefs.allowEditingPlayerStats} setChecked={(c) => {
              store.updatePreferences({allowEditingPlayerStats: c});
            }} label={'Allow editing player stats'} />
            <Toggle checked={prefs.allowEditingMonsterStats} setChecked={(c) => {
              store.updatePreferences({allowEditingMonsterStats: c});
            }} label={'Allow editing monster stats'} />
            <h2 className={'font-serif mb-2 mt-4'}>Persistence</h2>
            <Toggle checked={true} setChecked={() => {}} label={'Remember username across sessions'} />
          </div>
          <div className={'mt-6 p-4 border-t border-darker-600 flex justify-end'}>
            <button
              className={classNames(
                'text-black bg-dracula hover:bg-dracula-200',
                'px-3 py-2 rounded-md text-sm font-medium'
              )}

              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
})

export default PreferencesModal;