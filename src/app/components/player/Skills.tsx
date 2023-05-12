import React, {useEffect, useRef, useState} from 'react';
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
import {fetchPlayerSkills} from '@/utils';
import NumberInput from '../generic/NumberInput';

import {PlayerSkills} from '@/types/Player';
import {toast} from 'react-toastify';
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

    return (
        <div className={'flex items-center justify-between'}>
            <div className={'basis-60 flex items-center text-sm'}>
                <div className={'basis-8'}>
                    <Image src={image} alt={name}/>
                </div>
                <div>
                    {name}
                </div>
            </div>
            <div>
                <NumberInput
                    required
                    min={1}
                    max={99}
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
        </div>
    )
})

const UsernameLookup: React.FC = observer(() => {
    const store = useStore();
    const shouldRemember = store.prefs.rememberUsername;
    const [username, setUsername] = useState('');
    const btn = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // When the username changes, set it in the browser storage, if the preference is enabled.
        if (shouldRemember) {
            localforage.setItem('dps-calc-username', username).catch(() => {
            });
        }
    }, [shouldRemember, username]);

    useEffect(() => {
        // On first mount, if the "remember username" preference is enabled, try & load the username from the store.
        if (shouldRemember) {
            localforage.getItem('dps-calc-username').then((u) => {
                // Set the username
                setUsername(u as string);
            }).catch(() => {
            });
        }
    }, []);

    return (
        <>
            <input
                type={'text'}
                className={'form-control rounded w-full mt-auto'}
                placeholder={'Username'}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <button
                ref={btn}
                disabled={!username}
                type={'button'}
                className={'ml-1 text-sm btn'}
                onClick={async () => {
                    try {
                        const res = await toast.promise(
                            fetchPlayerSkills(username),
                            {
                                pending: `Fetching player skills...`,
                                success: `Done fetching player skills!`,
                                error: `Error fetching player skills`
                            },
                            {
                                toastId: 'skills-fetch'
                            }
                        )

                        if (res) store.updatePlayer({skills: res});
                    } catch (e) {}
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