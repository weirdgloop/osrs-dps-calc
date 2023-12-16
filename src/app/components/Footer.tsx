import React from "react";

const Footer: React.FC = () => {
  return (
    <div className={'border-t-8 border-body-500 dark:border-dark-300 py-4 px-4 items-center text-xs bg-btns-400 dark:bg-dark-500 text-body-300 dark:text-gray-300'}>
      <div className={'max-w-7xl mx-auto flex gap-4 justify-between flex-wrap'}>
        <div>
          &copy; {new Date().getFullYear()} <a href={'https://weirdgloop.org'}>Weird Gloop</a> &#183;{' '}
          <a href={'https://github.com/weirdgloop/osrs-dps-calc'}>Contribute on GitHub</a>
        </div>
        <div>
          <a href={'https://weirdgloop.org/privacy'}>Privacy</a> &#183;{' '}
          <a href={'https://weirdgloop.org/terms'}>Terms</a> &#183;{' '}
          <a href={'https://oldschool.runescape.wiki'}>OSRS Wiki</a>
        </div>
      </div>
    </div>
  )
}

export default Footer;
