import React, {useState} from 'react';
import Toggle from './generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {useTheme} from "next-themes";
import Modal from "@/app/components/generic/Modal";
import power from '@/public/img/misc/power.webp';
import LazyImage from "@/app/components/generic/LazyImage";

const PreferencesModal: React.FC = observer((props) => {
  const store = useStore();
  const {prefs, ui} = store;

  const [advancedIsOpen, setAdvancedIsOpen] = useState(false);

  return (
    <>
      <Modal
        isOpen={ui.showPreferencesModal}
        setIsOpen={(b) => store.updateUIState({showPreferencesModal: b})}
        title={'Preferences'}
      >
        <div>
          <h2 className={'font-serif font-bold mb-2 select-none'}>Interface</h2>
          <Toggle checked={prefs.advancedMode} setChecked={(c) => {
            if (prefs.advancedMode) {
              store.updatePreferences({advancedMode: false});
            } else {
              setAdvancedIsOpen(true);
            }
          }} label={'Advanced mode'} />
        </div>
        <div className={'mt-4'}>
          <h2 className={'font-serif font-bold mb-2 select-none'}>Additional outputs</h2>
          <Toggle checked={prefs.showHitDistribution} setChecked={(c) => {
            store.updatePreferences({showHitDistribution: c});
          }} label={'Show hit distribution graph'} />
          <Toggle checked={prefs.showLoadoutComparison} setChecked={(c) => {
            store.updatePreferences({showLoadoutComparison: c});
          }} label={'Show loadout comparison graph'} />
          <Toggle checked={prefs.showTtkComparison} setChecked={(c) => {
            store.updatePreferences({showTtkComparison: c});
          }} label={'Show time-to-kill comparison graph'} />
        </div>
        <Modal
          isOpen={advancedIsOpen}
          setIsOpen={setAdvancedIsOpen}
          title={'Advanced mode'}
          hideCloseButton={true}
          footerChildren={
            <>
              <button
                className={'btn text-sm'}
                onClick={() => setAdvancedIsOpen(false)}
              >
                No, keep disabled
              </button>
              <button
                className={'btn text-sm'}
                onClick={() => {
                  store.updatePreferences({advancedMode: true});
                  setAdvancedIsOpen(false);
                }}
              >
                Enable advanced mode
              </button>
            </>
          }
        >
          <div className={'flex gap-4'}>
            <div>
              <LazyImage src={power.src} width={100} />
            </div>
            <p className={'text-sm'}>
              Advanced mode is intended for <strong>power users</strong>. Enabling it will allow you to edit various
              player stats, equipment bonuses, and monster stats manually. This may cause the calculator to exhibit
              unexpected behaviour. Are you sure you want to turn this on?
            </p>
          </div>
        </Modal>
      </Modal>
    </>
  )
})

export default PreferencesModal;
