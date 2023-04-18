import React from 'react';

interface HelpLinkProps {
  href: string;
}

const HelpLink: React.FC<HelpLinkProps> = (props) => {
  const {href} = props;
  return (
    <a
      href={href}
      target={'_blank'}
      title={'Learn more'}
      className={'text-gray-500 transition-[background] bg-gray-800 hover:bg-gray-700 px-1 rounded'}
    >
        ?
    </a>
  )
}

export default HelpLink;