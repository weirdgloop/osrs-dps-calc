import React from 'react';
import { observer } from 'mobx-react-lite';
import DpsCalcLogo from '@/app/components/header/DpsCalcLogo';
import DiscordInvite from '@/app/components/header/DiscordInvite';
import ShareLoadoutButton from './ShareLoadoutButton';

const Header: React.FC = observer(() => (
  <div
    className="mx-auto px-3 sm:px-6 lg:px-8 bg-btns-400 dark:bg-dark-500 shadow border-b-4 border-body-500 dark:border-dark-200"
  >
    <div className="relative flex items-center justify-between h-16">
      <div className="flex-1 flex items-center justify-between">
        <DpsCalcLogo />
        <div className="block ml-6">
          <div className="flex text-body-200 text-xs font-medium space-x-2">
            <DiscordInvite />
            <ShareLoadoutButton />
          </div>
        </div>
      </div>
    </div>
  </div>
));

export default Header;
