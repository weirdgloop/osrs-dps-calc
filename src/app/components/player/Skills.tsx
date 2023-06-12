import React, {useId, useRef, useState} from 'react';
import Image, {StaticImageData} from 'next/image';

import attack from '@/public/img/bonuses/attack.png'
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magic from '@/public/img/bonuses/magic.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import prayer from '@/public/img/tabs/prayer.png';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import NumberInput from '../generic/NumberInput';

import {PlayerSkills} from '@/types/Player';
import localforage from 'localforage';

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
            <div>
                <NumberInput
                    id={id}
                    required
                    min={1}
                    max={99}
                    value={player.skills[field].toString()}
                    onChange={(v) => {
                        store.updatePlayer({
                            skills: {
                                [field]: v
                            }
                        })
                    }}
                />
            </div>
        </div>
    )
})

const UsernameLookup: React.FC = observer(() => {
    const store = useStore();
    const {username} = store.ui;
    const shouldRemember = store.prefs.rememberUsername;
    const [btnDisabled, setBtnDisabled] = useState(false);
    const btn = useRef<HTMLButtonElement>(null);

    return (
        <>
            <input
                type={'text'}
                className={'form-control rounded w-full mt-auto'}
                placeholder={'RuneScape name'}
                value={username}
                onChange={(e) => {
                  store.updateUIState({username: e.currentTarget.value});
                  if (shouldRemember) {
                    localforage.setItem('dps-calc-username', e.currentTarget.value).catch(() => {});
                  }
                }}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        btn.current?.click();
                    }
                }}
            />
            <button
                ref={btn}
                disabled={!username || btnDisabled}
                type={'button'}
                className={'ml-1 text-sm btn'}
                onClick={async () => {
                    setBtnDisabled(true);
                    await store.fetchCurrentPlayerSkills();
                    setBtnDisabled(false);
                }}
            >
                Lookup
            </button>
        </>
    )
})

const Skills: React.FC = observer(() => {
    return (
        <div className={'px-6 mt-4'}>
            <h4 className={`font-bold font-serif`}>
                Skills
            </h4>
            <p className={'text-xs'}>
                Input your username to fetch your stats, or enter them manually.
            </p>
            <div className={'flex items-center mt-3'}>
                <UsernameLookup/>
            </div>
            <div className={'flex flex-col gap-1 mt-4'}>
                <SkillInput name={'Attack'} field={'atk'} image={attack}/>
                <SkillInput name={'Strength'} field={'str'} image={strength}/>
                <SkillInput name={'Defence'} field={'def'} image={defence}/>
                <SkillInput name={'Hitpoints'} field={'hp'} image={hitpoints}/>
                <SkillInput name={'Ranged'} field={'ranged'} image={ranged}/>
                <SkillInput name={'Magic'} field={'magic'} image={magic}/>
                <SkillInput name={'Prayer'} field={'prayer'} image={prayer}/>
            </div>
        </div>
    )
})

export default Skills;