import Modal from '@/app/components/generic/Modal';
import React, { PropsWithChildren, useState } from 'react';
import { IconNews } from '@tabler/icons-react';

interface IChangelogEntryProps {
  date: string;
}

const ChangelogEntry: React.FC<PropsWithChildren<IChangelogEntryProps>> = (props) => {
  const { date, children } = props;

  return (
    <div className="border-t first:border-0 mt-2 first:mt-0 pt-2 first:pt-0 border-dark-300">
      <span className="rounded bg-green-500 px-1">{date}</span>
      <div className="mt-1">
        <ul className="list-inside list-disc text-gray-300">
          {children}
        </ul>
      </div>
    </div>
  );
};

const Changelog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] py-1.5 px-2.5 rounded-md dark:bg-dark-300 dark:border-dark-200 md:flex items-center gap-1 hidden"
        onClick={() => setIsOpen(true)}
      >
        <IconNews size={20} aria-label="Changelog" />
        <div className="hidden md:block">Changelog</div>
      </button>
      <Modal
        isOpen={isOpen}
        setIsOpen={(open) => setIsOpen(open)}
        title="Changelog"
      >
        <div className="text-sm bg-dark-500 rounded p-2 shadow-inner border border-dark-200 overflow-auto max-h-64">
          <ChangelogEntry date="5 June 2024">
            <li>
              Updated for this week&apos;s game update, including changing Flames of Zamorak to not count as a
              fire spell.
            </li>
            <li>
              Reworked ToA scaling.
            </li>
            <li>
              Fixed bug with selecting a monster where the wrong health scaling would be used.
            </li>
            <li>
              Added elder maul defence reduction.
            </li>
            <li>
              Added handling for
              {' '}
              <a href="https://oldschool.runescape.wiki/w/Flat_armour" target="_blank">flat armour</a>
              .
            </li>
          </ChangelogEntry>
          <ChangelogEntry date="3 June 2024">
            <li>
              Corrected elemental damage with slayer helmet.
            </li>
            <li>
              Fixed fire spells on ice demons.
            </li>
          </ChangelogEntry>
        </div>
        <div className="flex justify-center text-xs mt-3">
          <a
            href="https://github.com/weirdgloop/osrs-dps-calc/commits/main/"
            target="_blank"
            aria-label="Visit the GitHub repo"
          >
            View commits on GitHub
          </a>
        </div>
      </Modal>
    </>
  );
};

export default Changelog;
