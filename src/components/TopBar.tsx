import Link from 'next/link';
import {classNames} from '../utils';
import Image from 'next/image';
import hitsplat from '@/img/hitsplat.webp';
import PreferencesModal from '@/components/PreferencesModal';

export default function TopBar() {
  return (
      <>
        <div className="mx-auto px-2 sm:px-6 lg:px-8 bg-[#1a1b24] border-b border-b-cyan">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <Image src={hitsplat} alt={'Hitsplat'} className={'mr-1'} />
                <span className={'font-semibold text-white'}>DPS Calculator</span>
                <span className={'ml-1.5 text-gray-400 text-sm'}>for OSRS</span>
              </div>
              <div className="block ml-6">
                <div className="flex space-x-2">
                  <Link href={'https://oldschool.runescape.wiki'} passHref legacyBehavior>
                    <a
                      target={'_blank'}
                      rel={'noreferrer'}
                      className={classNames(
                        'text-white bg-gray-700 hover:bg-gray-600 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                    >
                      View the wiki
                    </a>
                  </Link>
                  <Link href={'https://oldschool.runescape.wiki'} passHref legacyBehavior>
                    <a
                      target={'_blank'}
                      rel={'noreferrer'}
                      className={classNames(
                        'text-white bg-gray-700 hover:bg-gray-600 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                    >
                      Preferences
                    </a>
                  </Link>
                  <PreferencesModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}