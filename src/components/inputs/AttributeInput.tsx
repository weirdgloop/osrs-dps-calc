import React from 'react';
import Image, {StaticImageData} from 'next/image';

interface AttributeInputProps {
  name: string;
  image: string | StaticImageData;
  value: number;
  onChange: (v: number) => void;
}

const AttributeInput: React.FC<AttributeInputProps> = (props) => {
  const {name, image, onChange, value} = props;

  return (
    <div className={'flex items-center'}>
      <div className={'basis-10'}>
        <Image src={image} alt={name} title={name} />
      </div>
      <div className={'basis-12'}>
        <input type={'number'} placeholder={'0'} className={'form-control rounded w-full mt-auto'} onChange={(evt) => {
          onChange(evt.currentTarget.valueAsNumber);
        }} value={value} />
      </div>
    </div>
  )
}

export default AttributeInput;