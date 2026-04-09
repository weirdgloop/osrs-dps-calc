import { observer } from 'mobx-react-lite';
import React from 'react';
import { Prayer, SortedPrayers } from '@/enums/Prayer';
import { useStore } from '@/state';
import GridItem from '@/app/components/generic/GridItem';

const Prayers: React.FC = observer(() => {
  const store = useStore();
  const { prayers } = store.player;

  return (
    <div className="px-4 mb-8">
      <div className="grid grid-cols-4 gap-y-4 mt-6 w-48 m-auto items-center justify-center">
        {
          SortedPrayers.filter(([,p]) => !p.renderInOther).map(([k, v]) => (
            <GridItem
              key={k}
              item={parseInt(k)}
              name={v.name}
              image={v.image}
              active={prayers.includes(parseInt(k))}
              onClick={(p: Prayer) => store.togglePlayerPrayer(p)}
            />
          ))
        }
      </div>
      {
        store.player.leagues.six.effects.talent_air_spell_damage_active_prayers && (
          <div className="mt-6">
            <p className="text-xs">
              You gain extra damage for each active prayer because of a Demonic Pact.
              Select any additional prayer you are using.
            </p>
            <div className="grid grid-cols-4 gap-y-4 mt-6 w-48 m-auto items-center justify-center">
              {
                SortedPrayers.filter(([,p]) => p.renderInOther).map(([k, v]) => (
                  <GridItem
                    key={k}
                    item={parseInt(k)}
                    name={v.name}
                    image={v.image}
                    active={prayers.includes(parseInt(k))}
                    onClick={(p: Prayer) => store.togglePlayerPrayer(p)}
                  />
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  );
});

export default Prayers;
