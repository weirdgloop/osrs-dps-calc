import { IconAlertTriangleFilled } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useIssues } from '@/state/IssuesStore';

const UnimplementedPactsWarning: React.FC = observer(() => {
  const { unimplementedPacts } = useIssues();
  if (!unimplementedPacts) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex justify-center items-center bg-orange-400 border-b border-orange-300 px-4 py-1">
        <div className="flex-col">
          <IconAlertTriangleFilled className="text-orange-300" />
        </div>
        <div className="flex-col">
          <div className="center px-4 text-xs">
            {'The following Demonic Pacts are not supported: '}
            <ul>
              {unimplementedPacts.map((issue) => (
                <li className="list-inside list-disc" key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default UnimplementedPactsWarning;
