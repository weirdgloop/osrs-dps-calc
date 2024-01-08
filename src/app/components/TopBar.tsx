import {classNames, generateShortlink} from '@/utils';
import {useStore} from '@/state';
import {IconMoon, IconSettings, IconShare2, IconSun} from '@tabler/icons-react';
import wiki from '@/public/img/Wiki@2x.webp';
import React from "react";
import {ImportableData} from "@/types/State";
import {toJS} from "mobx";
import {toast} from "react-toastify";
import {observer} from "mobx-react-lite";
import {useTheme} from "next-themes";

const TopBar: React.FC = observer(() => {
  const store = useStore();
  const {resolvedTheme, setTheme} = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
      <>
        <div className="mx-auto px-3 sm:px-6 lg:px-8 bg-btns-400 dark:bg-dark-500 shadow border-b-4 border-body-500 dark:border-dark-200">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-between">
              <div className="flex-shrink-0 flex items-center gap-2 select-none">
                <a target={'_blank'} href={'https://oldschool.runescape.wiki'}><img src={wiki.src} width={50} alt={'OSRS Wiki'} /></a>
                <span className={'font-bold font-serif text-white'}>DPS Calculator</span>
              </div>
              <div className="block ml-6">
                <div className="flex border border-body-500 bg-[#3e2816] dark:bg-dark-300 dark:border-dark-200 text-body-200 py-2 px-2.5 rounded-md text-sm font-medium space-x-4">
                  <button
                    data-tooltip-id={'tooltip'}
                    data-tooltip-content={`Toggle ${isDark ? 'light' : 'dark'} mode`}
                    className='transition-all hover:scale-105 hover:text-white'
                    onClick={() => {
                      setTheme(isDark ? 'light' : 'dark');
                    }}
                  >
                    {isDark ? (
                      <IconSun size={20} aria-label={'Toggle light mode'}/>
                    ) : (
                      <IconMoon size={20} aria-label={'Toggle dark mode'}/>
                    )}
                  </button>
                  <button
                    data-tooltip-id={'tooltip'}
                    data-tooltip-content={'Preferences'}
                    className='transition-all hover:scale-105 hover:text-white'
                    onClick={() => {
                      store.updateUIState({showPreferencesModal: true});
                    }}
                  >
                    <IconSettings size={20} aria-label={'Preferences'}/>
                  </button>
                  <button
                    data-tooltip-id={'tooltip'}
                    data-tooltip-content={'Share'}
                    className='transition-all hover:scale-105 hover:text-white'
                    onClick={() => {
                      store.updateUIState({showShareModal: true});
                    }}
                  >
                    <IconShare2 size={20} aria-label={'Share'}/>
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
