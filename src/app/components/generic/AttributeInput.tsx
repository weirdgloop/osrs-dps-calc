import React, {useEffect, useState} from 'react';
import Image, {StaticImageData} from 'next/image';

interface AttributeInputProps {
  name: string;
  image: string | StaticImageData;
  value: number;
  disabled?: boolean;
  onChange?: (v: number) => void;
}

const AttributeInput: React.FC<AttributeInputProps> = (props) => {
  const {name, image, onChange, value, disabled} = props;
  const [internalValue, setInternalValue] = useState(value.toString());

  useEffect(() => {
      setInternalValue(value.toString());
  }, [value]);

  return (
    <div className={'flex items-center'}>
      <div className={'basis-10'}>
        <Image src={image} alt={name} title={name} />
      </div>
      <div className={'basis-12'}>
          {
              disabled ? (
                  <div className={'w-full font-mono text-left py-[.25em] px-[.5em] text-sm border border-zinc-400 rounded cursor-not-allowed'}>
                      {value}
                  </div>
              ) : (
                  <input type={'number'} className={'form-control rounded w-full mt-auto'} onChange={(evt) => {
                      setInternalValue(evt.currentTarget.value);
                      if (evt.currentTarget.validity.valid && onChange) {
                          onChange(evt.currentTarget.valueAsNumber);
                      }
                  }} value={internalValue} />
              )
          }
      </div>
    </div>
  )
}

export default AttributeInput;