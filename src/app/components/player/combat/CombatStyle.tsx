import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { IconCircleCheck, IconCircleCheckFilled } from '@tabler/icons-react';

import LazyImage from '@/app/components/generic/LazyImage';
import { PlayerCombatStyle } from '@/types/PlayerCombatStyle';
import { StaticImageData } from 'next/image';
import { toJS } from 'mobx';
import isEqual from 'lodash.isequal';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { CombatStyleMap } from '@/utils';

interface CombatStyleProps {
  style: PlayerCombatStyle;
}

const CombatStyle: React.FC<CombatStyleProps> = observer((props) => {
  const store = useStore();
  const { player } = store;
  const { style } = props;

  const [hovering, setHovering] = useState(false);
  const [styleImage, setStyleImage] = useState<string | null>(null);

  const active = isEqual(toJS(player.style), style);

  useEffect(() => {
    // Import the combat style image dynamically using the path, because there are a lot of them
    const getStyleImage = async () => {
      let path = CombatStyleMap[store.equipmentData.weapon?.category || EquipmentCategory.NONE][style.name];

      if (style.type === 'magic' && style.stance === 'Defensive Autocast') {
        path = { image: 'styles/760' };
      } else if (style.type === 'magic' && ['Autocast', 'Manual Cast'].includes(style.stance || '')) {
        path = { image: 'tabs/spells' };
      } else if (path !== undefined) {
        path = { image: `styles/${path.image}` };
      }

      if (path === undefined) {
        setStyleImage('');
        return;
      }

      try {
        const r: StaticImageData = (await import(`@/public/img/${path.image}.png`)).default;
        setStyleImage(r ? r.src : '');
      } catch (e) {
        setStyleImage('');
      }
    };

    getStyleImage();
  }, [style, store.equipmentData.weapon?.category]);

  return (
    <button
      type="button"
      className="flex gap-4 items-center text-sm p-2 px-6 text-left transition-[background] first:border-t border-b text-black border-body-200 dark:border-dark-400 bg-gray-100 dark:bg-dark-500 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-400"
      onClick={() => store.player.update({ style })}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="h-[15px] w-[15px] flex justify-center">
        {styleImage && <LazyImage responsive src={styleImage} />}
      </div>
      <div>
        <div className="font-bold font-serif">
          {style.name}
        </div>
        <div className="text-xs capitalize">
          {style.type || 'None'}
          ,
          {' '}
          {style.stance || 'None'}
        </div>
      </div>
      {(hovering || active) && (
        <div className="ml-auto">
          {active ? <IconCircleCheckFilled className="text-green-400 dark:text-green-200" />
            : <IconCircleCheck className="text-gray-300" />}
        </div>
      )}
    </button>
  );
});

export default CombatStyle;
