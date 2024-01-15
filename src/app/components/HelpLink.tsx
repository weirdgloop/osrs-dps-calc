import React from 'react';

interface HelpLinkProps {
  href: string;
}

const HelpLink: React.FC<HelpLinkProps> = (props) => {
  const { href } = props;
  return (
    <a
      href={href}
      target="_blank"
      title="Learn more"
      className="text-gray-500 transition-[background] bg-body-200 dark:bg-dark-200 dark:text-white dark:hover:bg-dark-100 hover:bg-body-300 px-1 rounded no-underline"
      onClick={(e) => e.stopPropagation()}
    >
      ?
    </a>
  );
};

export default HelpLink;
