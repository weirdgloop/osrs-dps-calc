import React from 'react';
import Toggle from './generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {useTheme} from "next-themes";
import Modal from "@/app/components/generic/Modal";

interface IPreferencesModalProps {
  isOpen: boolean;
}

const PreferencesModal: React.FC<IPreferencesModalProps> = observer((props) => {
  const {isOpen} = props;
  const {resolvedTheme, setTheme} = useTheme();
  const store = useStore();
  const {prefs} = store;

  return (
    <Modal
        isOpen={isOpen}
        setIsOpen={(b) => store.updateUIState({showPreferencesModal: b})}
        title={'Preferences'}
    >
      <div>
        <h2 className={'font-serif font-bold mb-2 select-none'}>Interface</h2>
        <Toggle checked={resolvedTheme === 'dark'} setChecked={(c) => {
          setTheme(c ? 'dark' : 'light');
        }} label={'Dark mode'} />
        <Toggle checked={prefs.allowEditingPlayerStats} setChecked={(c) => {
          store.updatePreferences({allowEditingPlayerStats: c});
        }} label={'Enable editing player bonuses'} />
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
    </Modal>
  )
})

export default PreferencesModal;
