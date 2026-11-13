import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconExternalLink, IconShieldQuestion } from '@tabler/icons-react';
import LazyImage from '@/app/components/generic/LazyImage';
import { useMonster } from '@/state/MonsterStore';
import { getCdnImage } from '@/utils';

const MonsterHeader: React.FC = observer(() => {
  const monster = useMonster();
  const {
    id, name, version, image,
  } = monster.definition;

  return (
    <div
      className="px-6 py-2 border-b-body-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center bg-body-100 dark:bg-dark-400"
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center">
          {image ? (
            <LazyImage
              responsive
              src={getCdnImage(`monsters/${image}`)}
              alt={name || 'Unknown'}
            />
          ) : (
            <div>
              <IconShieldQuestion className="text-gray-300" />
            </div>
          )}
        </div>
        <h2 className="font-serif tracking-tight font-bold leading-4">
          {name || 'Monster'}
          <br />
          <span className="text-xs text-gray-500 dark:text-gray-300">{version}</span>
        </h2>
      </div>
      {(id > -1) && (
        <a
          className="text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 hover:text-gray-400"
          href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=npc&id=${id}`}
          target="_blank"
          title="Open wiki page"
          aria-label="Open wiki page"
        >
          <IconExternalLink size={20} />
        </a>
      )}
    </div>
  );
});

export default MonsterHeader;
