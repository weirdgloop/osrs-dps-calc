import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconExternalLink, IconShieldQuestion } from '@tabler/icons-react';
import { useMonster } from '@/state/MonsterStore';
import LazyImage from '@/app/components/generic/LazyImage';
import { getCdnImage } from '@/utils';

const MonsterImage: React.FC = observer(() => {
  const { monsterBase } = useMonster();

  return (
    <div className="w-10 h-10 flex items-center">
      {monsterBase.image && (
      <LazyImage src={getCdnImage(monsterBase.image)} alt={monsterBase.name} />
      )}
      {!monsterBase.image && (
      <div>
        <IconShieldQuestion className="text-gray-300" />
      </div>
      )}
    </div>
  );
});

const MonsterLabel: React.FC = observer(() => {
  const { monsterBase } = useMonster();

  return (
    <h2 className="font-serif tracking-tight font-bold leading-4">
      {monsterBase.name ?? 'Monster'}
      <br />
      <span className="text-xs text-gray-500 dark:text-gray-300">{monsterBase.version}</span>
    </h2>
  );
});

const MonsterWikiLink: React.FC = observer(() => {
  const { monsterBase, isCustomMonster } = useMonster();

  if (isCustomMonster) {
    return null;
  }

  return (
    <a
      className="text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 hover:text-gray-400"
      href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=npc&id=${monsterBase.id}`}
      target="_blank"
      title="Open wiki page"
      aria-label="Open wiki page"
    >
      <IconExternalLink size={20} />
    </a>
  );
});

const MonsterHeader: React.FC = observer(() => (
  <div
    className="px-6 py-2 border-b-body-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center bg-body-100 dark:bg-dark-400"
  >
    <div className="flex items-center gap-2">
      <MonsterImage />
      <MonsterLabel />
    </div>
    <MonsterWikiLink />
  </div>
));

export default MonsterHeader;
