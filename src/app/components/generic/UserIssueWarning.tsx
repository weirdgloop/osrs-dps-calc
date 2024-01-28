import React from 'react';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import { UserIssue } from '@/types/State';
import { classNames } from '@/utils';

interface IUserIssueProps {
  issue: UserIssue;
  className?: string;
}

const UserIssueWarning: React.FC<IUserIssueProps> = (props) => {
  const { issue, className } = props;
  return (
    <div
      className={classNames('cursor-help', className || '')}
      data-tooltip-id="tooltip-warning"
      data-tooltip-content={issue.message}
    >
      <IconAlertTriangleFilled className="text-orange-300 w-5" />
    </div>
  );
};

export default UserIssueWarning;
