import React, { useState } from 'react';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import HelpLink from '@/app/components/HelpLink';
import MonsterAccordion from '@/app/components/monster/MonsterAccordion';
import PresetAttributeButton from '@/app/components/monster/PresetAttributeButton';

const MonsterAttributes: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MonsterAccordion
      title={(
        <>
          Attributes
          {' '}
          <HelpLink href="https://oldschool.runescape.wiki/w/Monster_attribute" />
        </>
      )}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="py-2 px-2 flex flex-wrap gap-1.5">
        {Object.values(MonsterAttribute).map((attr) => <PresetAttributeButton key={attr} attr={attr} />)}
      </div>
    </MonsterAccordion>
  );
};

export default MonsterAttributes;
