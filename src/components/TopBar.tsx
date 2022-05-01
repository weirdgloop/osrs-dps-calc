import Image from 'next/image';
import logo from '../public/img/logo.png';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TopBar() {
  return (
      <>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <Image src={logo} width={18} height={30} className={'block'} alt={'Logo'} />
                <span className={'ml-3 text-white font-semibold'}>DPS Calculator</span>
              </div>
              <div className="block ml-6">
                <div className="flex space-x-4">
                  <Link href={'https://oldschool.runescape.wiki'} passHref>
                    <a
                      target={'_blank'}
                      rel={'noreferrer'}
                      className={classNames(
                        'text-white bg-gray-700 hover:bg-gray-600 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                    >
                      Visit OSRS Wiki
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}