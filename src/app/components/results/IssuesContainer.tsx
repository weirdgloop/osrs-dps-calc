import React, { PropsWithChildren, useMemo } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';

interface WarningLineProps {
  loadoutName?: string;
}

const WarningLine: React.FC<PropsWithChildren<WarningLineProps>> = (props) => {
  const { children, loadoutName } = props;

  return (
    <li>
      <IconAlertTriangle width={15} className="inline-block text-orange-600" />
      {' '}
      {children}
      {loadoutName && (
        <>
          {' '}
          <span className="text-gray-400 dark:text-gray-300">
            (
            {loadoutName}
            )
          </span>
        </>
      )}
    </li>
  );
};

const IssuesContainer: React.FC = observer(() => {
  const store = useStore();
  const { issues } = store.ui;
  const hasIssues = issues.length > 0;

  const issueComps = useMemo(() => (
    // eslint-disable-next-line react/no-array-index-key
    issues.map((i, ix) => <WarningLine key={ix} loadoutName={i.loadoutName}>{i.message}</WarningLine>)
  ), [issues]);

  return (
    <div
      className="mt-3 sm:rounded shadow-lg bg-body-100 dark:bg-dark-400 text-sm"
    >
      <div
        className={`px-4 py-2 flex font-serif tracking-tight font-bold justify-between items-center transition-colors ${hasIssues ? 'md:rounded md:rounded-bl-none md:rounded-br-none border-b-orange-700 border-b bg-orange-800 text-white' : 'md:rounded'}`}
      >
        <h1>
          Issues
        </h1>
        <span className={`px-1 rounded text-white ${hasIssues ? 'bg-orange-900' : 'bg-gray-500'}`}>{issues.length}</span>
      </div>
      {hasIssues ? (
        <div className="px-4 my-2 text-xs overflow-y-auto max-h-40">
          <ul>
            {issueComps}
          </ul>
        </div>
      ) : null}
    </div>
  );
});

export default IssuesContainer;
