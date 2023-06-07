import React from 'react';
import {Dialog} from '@headlessui/react';
import {classNames} from '@/utils';
import Toggle from './generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {useTheme} from "next-themes";

interface IPreferencesModalProps {
  isOpen: boolean;
}

const PreferencesModal: React.FC<IPreferencesModalProps> = observer((props) => {
  const {isOpen} = props;
  const {resolvedTheme, setTheme} = useTheme();
  const store = useStore();
  const {prefs} = store;

  const setIsOpen = (open: boolean) => {
    store.updateUIState({showPreferencesModal: open});
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className={'fixed inset-0 flex items-center justify-center p-4'}>
        <Dialog.Panel className={'w-full max-w-lg rounded-xl bg-white dark:bg-dark-300 dark:text-white text-black shadow-xl'}>
          <Dialog.Title className={'py-3 text-md bg-btns-300 dark:bg-dark-500 font-bold rounded-t-lg text-center text-white font-serif select-none'}>
            Preferences
          </Dialog.Title>
          <div className={'px-4 py-2 max-w-xl mt-2 mx-auto'}>
            <div>
              <h2 className={'font-serif font-bold mb-2 select-none'}>Interface</h2>
              <Toggle checked={resolvedTheme === 'dark'} setChecked={(c) => {
                setTheme(c ? 'dark' : 'light');
              }} label={'Dark mode'} />
              <Toggle checked={prefs.allowEditingPlayerStats} setChecked={(c) => {
                store.updatePreferences({allowEditingPlayerStats: c});
              }} label={'Enable editing player bonuses'} help={'This will allow you to override the values provided by your equipment.'} />
              <Toggle checked={prefs.allowEditingMonsterStats} setChecked={(c) => {
                store.updatePreferences({allowEditingMonsterStats: c});
              }} label={'Enable editing monster stats'} />
            </div>
            <div className={'mt-4'}>
              <h2 className={'font-serif font-bold mb-2 select-none'}>Additional outputs</h2>
              <Toggle checked={prefs.showHitDistribution} setChecked={(c) => {
                store.updatePreferences({showHitDistribution: c});
              }} label={'Show hit distribution graph'} />
              <Toggle checked={prefs.showLoadoutComparison} setChecked={(c) => {
                store.updatePreferences({showLoadoutComparison: c});
              }} label={'Show loadout comparison graph'} />
            </div>
          </div>
          <div className={'mt-3 p-4 border-t border-gray-300 dark:border-dark-200 flex justify-end'}>
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
    </Dialog>
  )
})

export default PreferencesModal;