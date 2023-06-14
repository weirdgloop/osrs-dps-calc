import React from 'react';

interface NumberInputProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  onChange?: (v: number) => void;
  value?: number;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const {onChange} = props;

  return (
    <input
      type={'number'}
      className={'form-control w-16'}
      {...props}
      defaultValue={props.value}
      onChange={(evt) => {
        // If it's a valid number (passes local HTML validation), call our onChange
        if (evt.currentTarget.validity.valid && onChange) {
          onChange(evt.currentTarget.valueAsNumber);
        }
      }}
    />
  )
}

export default NumberInput;