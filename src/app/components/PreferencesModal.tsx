import React, {useState} from 'react';
import Toggle from './generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Modal from "@/app/components/generic/Modal";
import power from '@/public/img/misc/power.webp';
import LazyImage from "@/app/components/generic/LazyImage";

const PreferencesModal: React.FC = observer(() => {
  const store = useStore();
  const {prefs, ui} = store;

  const [advancedIsOpen, setManualIsOpen] = useState(false);

  return (
    <>
      <Modal
        isOpen={ui.showPreferencesModal}
        setIsOpen={(b) => store.updateUIState({showPreferencesModal: b})}
        title={'Preferences'}
      >
        <div>
          <h2 className={'font-serif font-bold mb-2 select-none'}>Interface</h2>
          <Toggle checked={prefs.manualMode} setChecked={() => {
            if (prefs.manualMode) {
              store.updatePreferences({manualMode: false});
            } else {
              setManualIsOpen(true);
            }
          }} label={'Manual mode'} />
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
          setIsOpen={setManualIsOpen}
          title={'Manual mode'}
          hideCloseButton={true}
          footerChildren={
            <>
              <button
                className={'btn text-sm'}
                onClick={() => setManualIsOpen(false)}
              >
                No, keep disabled
              </button>
              <button
                className={'btn text-sm'}
                onClick={() => {
                  store.updatePreferences({manualMode: true});
                  setManualIsOpen(false);
                }}
              >
                Enable manual mode
              </button>
            </>
          }
        >
          <div className={'flex gap-4'}>
            <div>
              <LazyImage src={power.src} width={100} />
            </div>
            <div className={'text-sm'}>
              <p>
                Manual mode allows you to edit various player stats, equipment bonuses, and monster stats manually.
                This is <strong>likely</strong> to cause the calculator to exhibit unexpected behaviour.
                We recommend keeping it off if you don&apos;t know what you&apos;re doing.
              </p>
              <p className={'mt-2'}>Are you sure you want to turn this on?</p>
            </div>
          </div>
        </Modal>
      </Modal>
    </>
  )
})

export default PreferencesModal;
