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
} from '@/lib/GridMaster';
import NumberInput from '@/app/components/generic/NumberInput';
import magic_2 from '@/public/img/gridmaster/magic_2.png';
import minimum_potential from '@/public/img/gridmaster/minimum_potential.png';
import exposure from '@/public/img/gridmaster/exposure.png';

const MasteryButton: React.FC<MasteryUiData<MasteryStyle>> = observer((props) => {
  const {
    masteryStyle,
    mastery,
    name,
    image,
  } = props;

  const store = useStore();
  const { gridmaster: data } = store.player;

  let ix = 0;
  if (masteryStyle === 'ranged') {
    ix += 6;
  } else if (masteryStyle === 'magic') {
    ix += 12;
  }

  const onClick = () => {
    if (store.player.gridmaster[masteryStyle] === mastery) {
      store.updatePlayer({ gridmaster: { [masteryStyle]: 0 } });
    } else {
      store.updatePlayer({ gridmaster: { [masteryStyle]: mastery } });
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

const GridMaster: React.FC = observer(() => {
  const store = useStore();
  const { gridmaster: data } = store.player;

  const passives = [];
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

      <h4 className="mt-4 font-bold font-serif">
        Unlocks
      </h4>

      <div className="grid grid-cols-6 gap-x-[.5em] gap-y-4 my-4 w-60 m-auto items-center justify-center">
        <GridItem
          item={1}
          name="Minimum Potential"
          image={minimum_potential}
          onClick={() => store.updatePlayer({ gridmaster: { minimumPotential: !data.minimumPotential } })}
          active={!!data?.minimumPotential}
          width={40}
          height={40}
        />
        <GridItem
          item={2}
          name="Exposure"
          image={exposure}
          onClick={() => store.updatePlayer({ gridmaster: { exposure: !data.exposure } })}
          active={!!data?.exposure}
          width={40}
          height={40}
        />
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
              onChange={(v) => store.updatePlayer({ gridmaster: { ticksDelayed: v } })}
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

export default GridMaster;
