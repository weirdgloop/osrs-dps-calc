import {classNames} from '@/utils';
import {useStore} from '@/state';
import {IconSettings} from '@tabler/icons-react';
import wiki from '@/public/img/Wiki@2x.webp';
import React from "react";

const TopBar: React.FC = () => {
  const store = useStore();

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}

export default TopBar;
