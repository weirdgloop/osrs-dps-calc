import React from 'react';
import { IconBrandGithub } from '@tabler/icons-react';
import ManualModeToggle from '@/app/components/manual/ManualModeToggle';

const Footer: React.FC = () => (
  <div
    className="border-t-8 border-body-500 dark:border-dark-300 py-4 px-4 items-center text-xs bg-btns-400 dark:bg-dark-500 text-body-300 dark:text-gray-300"
  >
    <div className="max-w-7xl mx-auto flex gap-4 justify-between flex-wrap">
      <div className="flex gap-2 items-center">
        <div>
          &copy;
          {' '}
          {new Date().getFullYear()}
          {' '}
          <a href="https://weirdgloop.org" target="_blank">Weird Gloop</a>
        </div>
        <a
          className="flex border rounded-full p-0.5 border-gray-400"
          href="https://github.com/weirdgloop/osrs-dps-calc"
          target="_blank"
          aria-label="Visit the GitHub repo"
        >
          <IconBrandGithub size={15} />
        </a>
        {process.env.GIT_SHA && (
          <a href={`https://github.com/weirdgloop/osrs-dps-calc/tree/${process.env.GIT_SHA}`} target="_blank">
            {`${process.env.GIT_SHA_SHORT}${process.env.GIT_DIRTY === 'true' ? '*' : ''}`}
          </a>
        )}
      </div>
      <div>
        <ManualModeToggle />
        {' '}
        &#183;
        {' '}
        <a href="https://weirdgloop.org/privacy" target="_blank">Privacy</a>
        {' '}
        &#183;
        {' '}
        <a href="https://weirdgloop.org/terms" target="_blank">Terms</a>
        {' '}
        &#183;
        {' '}
        <a href="https://oldschool.runescape.wiki" target="_blank">OSRS Wiki</a>
      </div>
    </div>
  </div>
);

export default Footer;
