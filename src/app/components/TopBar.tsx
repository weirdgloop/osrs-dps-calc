import {classNames, generateShortlink} from '@/utils';
import {useStore} from '@/state';
import {IconSettings, IconShare2} from '@tabler/icons-react';
import wiki from '@/public/img/Wiki@2x.webp';
import React from "react";
import {ImportableData} from "@/types/State";
import {toJS} from "mobx";
import {toast} from "react-toastify";
import {observer} from "mobx-react-lite";

const TopBar: React.FC = observer(() => {
  const store = useStore();
  const {blockSharing} = store.ui;

  const generateShareLink = async () => {
    store.updateUIState({blockSharing: true});
    // Get the data we need from the internal store
    const data: ImportableData = {
      loadouts: toJS(store.loadouts),
      monster: toJS(store.monster),
      selectedLoadout: store.selectedLoadout
    }

    // Make an API call to generate a share link
    try {
      const linkId = await generateShortlink(data);
      await navigator.clipboard.writeText(`https://dps.osrs.wiki/?id=${linkId}`);
      toast.success(`Copied share link to the clipboard!`);
    } catch (e) {
      // Failed...
      toast.error('Could not create share link. Please try again later.');
      store.updateUIState({blockSharing: false});
    }
  }

  return (
      <>
        <div className="mx-auto px-3 sm:px-6 lg:px-8 bg-btns-400 shadow border-b-4 border-body-500">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-between">
              <div className="flex-shrink-0 flex items-center gap-2 select-none">
                <a target={'_blank'} href={'https://oldschool.runescape.wiki'}><img src={wiki.src} width={50} alt={'OSRS Wiki'} /></a>
                <span className={'font-bold font-serif text-white'}>DPS Calculator</span>
              </div>
              <div className="block ml-6">
                <div className="flex space-x-2">
                  <button
                    data-tooltip-id={'tooltip'}
                    data-tooltip-content={'Preferences'}
                    className={classNames(
                      'flex items-center gap-1 text-white border border-body-500 bg-[#3e2816] transition-all hover:scale-105',
                      'px-3 py-2 rounded-md text-sm font-medium'
                    )}
                    onClick={() => {
                      store.updateUIState({showPreferencesModal: true});
                    }}
                  >
                    <IconSettings size={20} />
                  </button>
                  <button
                    disabled={blockSharing}
                    data-tooltip-id={'tooltip'}
                    data-tooltip-content={'Share'}
                    className={classNames(
                      'disabled:opacity-30 flex items-center gap-1 text-white border border-body-500 bg-[#3e2816] transition-all hover:scale-105',
                      'px-3 py-2 rounded-md text-sm font-medium'
                    )}
                    onClick={generateShareLink}
                  >
                    <IconShare2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
})

export default TopBar;
