import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import GridItem from '@/app/components/generic/GridItem';
import {
  MAGIC_MASTERIES,
  MELEE_MASTERIES,
  RANGED_MASTERIES,
  MasteryStyle,
  MasteryUiData,
} from '@/lib/LeaguesV';
import NumberInput from '@/app/components/generic/NumberInput';
import magic_2 from '@/public/img/league/magic_2.png';

const MasteryButton: React.FC<MasteryUiData<MasteryStyle>> = observer((props) => {
  const {
    masteryStyle,
    mastery,
    name,
    image,
  } = props;

  const store = useStore();
  const { five: data } = store.player.leagues;

  let ix = 0;
  if (masteryStyle === 'ranged') {
    ix += 6;
  } else if (masteryStyle === 'magic') {
    ix += 12;
  }

  const onClick = () => {
    if (store.player.leagues.five[masteryStyle] === mastery) {
      store.updatePlayer({ leagues: { five: { [masteryStyle]: 0 } } });
    } else {
      store.updatePlayer({ leagues: { five: { [masteryStyle]: mastery } } });
    }
  };

  return (
    <GridItem
      item={ix}
      name={name}
      image={image}
      onClick={onClick}
      active={data[masteryStyle] >= mastery}
      width={40}
      height={40}
    />
  );
});

const EchoesLeague: React.FC = observer(() => {
  const store = useStore();
  const { five: data } = store.player.leagues;

  const passives = [];
  const meleeEffects = [
    'Melee hits have a 25% chance to roll damage twice and take the highest result.',
    'Melee hits have a 10% chance to generate an echo hit',
    'Melee attack rate set to 80%, rounding down.',
    'Melee hits have a 5% chance to heal 40% of damage dealt.',
    'Melee attack rate set to 50%, rounded down above 5t, rounded up below 4t.',
    'Your chance to generate a Melee echo increases to 20%, and your echoes can generate additional echoes',
  ];
  const rangedEffects = [
    'Damage rolls beneath 30% of max hit with Ranged are increased to 30%.',
    'Each subsequent Ranged attack has its max hit increased by an additional 5%. Resets after +20%.',
    'Ranged attack rate set to 80%, rounding down.',
    'Every 5th Ranged hit, heal 5 hitpoints.',
    'Ranged attack rate set to 50%, rounded down above 5t, rounded up below 4t.',
    'Never miss with Ranged (PvM only).',
  ];
  const magicEffects = [
    'When you roll above 90% of your max hit with Magic, damage is increased by 50%.',
    'Magic max hit is increased by 5% per tick in-between your attacks (Up to +40%).',
    'Magic attack rate set to 80%, rounding down.',
    'When you roll above 90% of your max hit with Magic, heal 10% of damage dealt.',
    'Magic attack rate set to 50%, rounded down above 5t, rounded up below 4t.',
    'Max hit with Magic is increased by 1% for every 100 Hitpoints remaining on target (Up to 10%). On a successful Magic hit, if your target has less Hitpoints than your max hit, you max hit.',
  ];
  const maxMastery = Math.max(data.melee, data.ranged, data.magic);
  if (maxMastery >= 3) {
    passives.push('+100% accuracy');
  }
  if (maxMastery >= 6) {
    passives.push('+60% prayer penetration');
  }

  return (
    <div className="px-6 mb-4">
      <h4 className="mt-4 font-bold font-serif">
        Masteries
      </h4>

      <div className="grid grid-cols-6 gap-x-[.5em] gap-y-4 my-4 w-60 m-auto items-center justify-center">
        {MELEE_MASTERIES.map((r) => (<MasteryButton {...r} key={r.name} />))}
        {RANGED_MASTERIES.map((r) => (<MasteryButton {...r} key={r.name} />))}
        {MAGIC_MASTERIES.map((r) => (<MasteryButton {...r} key={r.name} />))}
      </div>

      {data.magic >= 2 && (
        <div className="my-4">
          <div className="w-full">
            <NumberInput
              className="form-control w-12"
              required
              min={0}
              max={8}
              value={data.ticksDelayed}
              onChange={(v) => store.updatePlayer({ leagues: { five: { ticksDelayed: v } } })}
            />
            <span className="ml-1 text-sm select-none">
              <img src={magic_2.src} width={24} className="inline-block" alt="" />
              {' '}
              Extra delay ticks
              {' '}
              <span
                className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
                data-tooltip-id="tooltip"
                data-tooltip-content="Extra ticks delayed between attacks on top of the normal weapon attack speed."
              >
                ?
              </span>
            </span>
          </div>
        </div>
      )}

      {(data.melee > 0) && (
        <div className="ml-1 my-4 text-gray-300 text-sm justify-center">
          Melee:
          <ul className="list-disc ml-5">
            {meleeEffects.slice(0, data.melee).map((melee, i) => (
              // each index is always the same string
              // eslint-disable-next-line react/no-array-index-key
              <li className="list-" key={i}>{melee}</li>
            ))}
          </ul>
        </div>
      )}
      {(data.ranged > 0) && (
        <div className="ml-1 my-4 text-gray-300 text-sm justify-center">
          Ranged:
          <ul className="list-disc ml-5">
            {rangedEffects.slice(0, data.ranged).map((range, i) => (
              // each index is always the same string
              // eslint-disable-next-line react/no-array-index-key
              <li className="list-" key={i}>{range}</li>
            ))}
          </ul>
        </div>
      )}
      {(data.magic > 0) && (
        <div className="ml-1 my-4 text-gray-300 text-sm justify-center">
          Magic:
          <ul className="list-disc ml-5">
            {magicEffects.slice(0, data.magic).map((magic, i) => (
              // each index is always the same string
              // eslint-disable-next-line react/no-array-index-key
              <li className="list-" key={i}>{magic}</li>
            ))}
          </ul>
        </div>
      )}
      {(passives.length > 0) && (
        <div className="ml-1 my-4 text-gray-300 text-sm justify-center">
          Passives:
          <ul className="list-disc ml-5">
            {passives.map((passive, i) => (
              // each index is always the same string
              // eslint-disable-next-line react/no-array-index-key
              <li className="list-" key={i}>{passive}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default EchoesLeague;
