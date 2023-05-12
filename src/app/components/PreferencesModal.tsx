import React from 'react';
import {Dialog} from '@headlessui/react';
import {classNames} from '@/utils';
import Toggle from './generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {motion, AnimatePresence} from 'framer-motion';

const PreferencesModal: React.FC = observer(() => {
  const store = useStore();
  const {ui, prefs} = store;

  const isOpen = ui.showPreferencesModal;
  const setIsOpen = (open: boolean) => {
    store.updateUIState({showPreferencesModal: open});
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <AnimatePresence>
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
          <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
          <div className={'fixed inset-0 flex items-center justify-center p-4'}>
            <Dialog.Panel className={'w-full max-w-lg rounded-xl bg-body-100 text-black shadow-xl'}>
              <Dialog.Title className={'py-3 text-md bg-btns-300 rounded-t-lg text-center text-white font-serif'}>
                Preferences
              </Dialog.Title>
              <div className={'px-4 py-2 max-w-xl mt-2 mx-auto'}>
                <h2 className={'font-serif mb-2'}>Interface</h2>
                <Toggle checked={prefs.allowEditingPlayerStats} setChecked={(c) => {
                  store.updatePreferences({allowEditingPlayerStats: c});
                }} label={'Allow editing player stats'} />
                <Toggle checked={prefs.allowEditingMonsterStats} setChecked={(c) => {
                  store.updatePreferences({allowEditingMonsterStats: c});
                }} label={'Allow editing monster stats'} />
                <h2 className={'font-serif mb-2 mt-4'}>Persistence</h2>
                <Toggle checked={prefs.rememberUsername} setChecked={(c) => {
                  store.updatePreferences({rememberUsername: c})
                }} label={'Remember username across sessions'} />
              </div>
              <div className={'mt-3 p-4 border-t border-body-300 flex justify-end'}>
                <button
                  className={classNames(
                    'btn',
                    'text-sm'
                  )}

                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </motion.div>
      </AnimatePresence>
    </Dialog>
  )
})

export default PreferencesModal;