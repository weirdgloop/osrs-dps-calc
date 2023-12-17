import {PlayerSkills} from "@/types/Player";
import Image, {StaticImageData} from "next/image";
import React, {useId} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import NumberInput from "@/app/components/generic/NumberInput";

interface SkillInputProps {
  name: string;
  field: keyof PlayerSkills;
  image: string | StaticImageData;
}

const SkillInput: React.FC<SkillInputProps> = observer((props) => {
  const store = useStore();
  const {player} = store;
  const {name, field, image} = props;
  const id = useId();

  return (
    <div className={'flex items-center justify-between'}>
      <div className={'basis-60 flex items-center text-sm'}>
        <div className={'basis-8'}>
          <Image src={image} alt={name}/>
        </div>
        <label htmlFor={id}>
          {name}
        </label>
      </div>
      <div className={'flex gap-1'}>
        <div>
          <NumberInput
            id={id}
            required
            min={1}
            max={99}
            title={`Your ${name} level`}
            value={player.skills[field]}
            onChange={(v) => {
              store.updatePlayer({
                skills: {
                  [field]: v
                }
              })
            }}
          />
        </div>
        <div>
          <NumberInput
            id={id}
            required
            min={-100}
            max={100}
            title={`Your ${name} bonuses`}
            value={player.boosts[field]}
            onChange={(v) => {
              store.updatePlayer({
                boosts: {
                  [field]: v
                }
              })
            }}
          />
        </div>
      </div>
    </div>
  )
})

export default SkillInput;
