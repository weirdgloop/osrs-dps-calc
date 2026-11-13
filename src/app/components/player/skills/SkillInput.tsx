import React, { useId } from 'react';
import Image, { StaticImageData } from 'next/image';
import { PlayerSkills } from '@/types/Player';
import BoostedLevel from '@/app/components/player/skills/BoostedLevel';
import BaseLevelInput from '@/app/components/player/skills/BaseLevelInput';

interface SkillInputProps {
  name: string;
  field: keyof PlayerSkills;
  image: string | StaticImageData;
}

const SkillInput: React.FC<SkillInputProps> = ({ name, field, image }) => {
  const id = useId();

  return (
    <>
      <div className="text-sm flex justify-center">
        <Image src={image} alt={name} />
      </div>
      <div className="flex items-center w-32">
        <div className="text-sm font-mono w-14 text-right">
          <BoostedLevel id={id} name={name} field={field} />
        </div>
        <div className="w-12">
          <BaseLevelInput id={id} name={name} field={field} />
        </div>
      </div>
    </>
  );
};

export default SkillInput;
