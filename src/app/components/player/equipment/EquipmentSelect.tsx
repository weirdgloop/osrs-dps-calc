import React, {useMemo} from 'react';
import equipment from '../../../../../cdn/json/equipment.json';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';
import {getCdnImage} from '@/utils';
import {EquipmentPiece} from '@/types/Player';
import Combobox from '../../generic/Combobox';
import LazyImage from "@/app/components/generic/LazyImage";
import {cross} from "d3-array";

interface EquipmentOption {
  label: string;
  value: string;
  version: string;
  slot: string;
  equipment: EquipmentPiece;
}

const BLOWPIPE_IDS: string[] = [
  "12926", // regular
  "28688", // blazing
];

const DART_IDS: string[] = [
  "806", // bronze
  "807", // iron
  "808", // steel
  "809", // mithril
  "810", // adamant
  "811", // rune
  "3093", // black
  "11230", // dragon
  "25849", // amethyst
];

const EquipmentSelect: React.FC = observer(() => {
  const store = useStore();

  const options: EquipmentOption[] = useMemo(() => {
    const blowpipeEntries: EquipmentOption[] = [];
    const dartEntries: EquipmentOption[] = [];

    const entries: EquipmentOption[] = [];
    Object.entries(equipment).forEach(([k, v]) => {
      let e: EquipmentOption = {
        label: `${v.name}`,
        value: k,
        version: v.version || '',
        slot: v.slot,
        equipment: {
          ...(v as EquipmentPiece)
        }
      };

      if (BLOWPIPE_IDS.includes(e.value)) {
        blowpipeEntries.push(e);
      } else if (DART_IDS.includes(e.value)) {
        dartEntries.push(e);
        entries.push(e);
      } else {
        entries.push(e);
      }
    });

    cross(blowpipeEntries, dartEntries).forEach(([blowpipe, dart]) => {
      const newStrength = blowpipe.equipment.offensive[4] + dart.equipment.offensive[4];
      entries.push({
        ...blowpipe,
        label: `${blowpipe.label} (${dart.label.split(' ', 2)[0]})`,
        value: `${blowpipe.value}_${dart.value}`,
        equipment: {
          ...blowpipe.equipment,
          offensive: [
            ...blowpipe.equipment.offensive.slice(0, 4),
            newStrength,
            ...blowpipe.equipment.offensive.slice(5),
          ],
        }
      });
    });

    return entries;
  }, [])

  return (
    <Combobox<EquipmentOption>
      id={'equipment-select'}
      className={'w-full'}
      items={options}
      resetAfterSelect={true}
      placeholder={'Search for equipment...'}
      onSelectedItemChange={(item) => {
        if (item) {
          store.updatePlayer({
            equipment: {
              [item.equipment.slot]: item.equipment
            }
          })
        }
      }}
      CustomItemComponent={({item, itemString}) => {
        return (
          <div className={'flex items-center gap-2'}>
            <div className={'basis-4 flex justify-center h-[20px] w-auto'}>
              {item.equipment.image && (<LazyImage responsive={true} src={item.equipment.image ? getCdnImage(`equipment/${item.equipment.image}`) : undefined} alt={''} />)}
            </div>
            <div>
              {itemString}
              {item.version && <span className={'monster-version text-xs text-gray-400 dark:text-gray-300'}>#{item.version}</span>}
            </div>
          </div>
        )
      }}
    />
  )
})

export default EquipmentSelect;
