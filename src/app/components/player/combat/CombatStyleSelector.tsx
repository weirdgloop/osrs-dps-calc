import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconCircleCheck, IconCircleCheckFilled } from '@tabler/icons-react';

import { getCombatStylesForCategory, PlayerCombatStyle } from '@/types/PlayerCombatStyle';
import Image, { StaticImageData } from 'next/image';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { RenderData } from '@/utils';
import { usePlayer } from '@/state/LoadoutStore';
import style128 from '@/public/img/styles/style128.png';
import style233 from '@/public/img/styles/style233.png';
import style234 from '@/public/img/styles/style234.png';
import style235 from '@/public/img/styles/style235.png';
import style236 from '@/public/img/styles/style236.png';
import style237 from '@/public/img/styles/style237.png';
import style238 from '@/public/img/styles/style238.png';
import style239 from '@/public/img/styles/style239.png';
import style240 from '@/public/img/styles/style240.png';
import style241 from '@/public/img/styles/style241.png';
import style242 from '@/public/img/styles/style242.png';
import style243 from '@/public/img/styles/style243.png';
import style244 from '@/public/img/styles/style244.png';
import style245 from '@/public/img/styles/style245.png';
import style246 from '@/public/img/styles/style246.png';
import style247 from '@/public/img/styles/style247.png';
import style248 from '@/public/img/styles/style248.png';
import style249 from '@/public/img/styles/style249.png';
import style250 from '@/public/img/styles/style250.png';
import style251 from '@/public/img/styles/style251.png';
import style252 from '@/public/img/styles/style252.png';
import style253 from '@/public/img/styles/style253.png';
import style254 from '@/public/img/styles/style254.png';
import style255 from '@/public/img/styles/style255.png';
import style256 from '@/public/img/styles/style256.png';
import style258 from '@/public/img/styles/style258.png';
import style259 from '@/public/img/styles/style259.png';
import style260 from '@/public/img/styles/style260.png';
import style261 from '@/public/img/styles/style261.png';
import style262 from '@/public/img/styles/style262.png';
import style263 from '@/public/img/styles/style263.png';
import style264 from '@/public/img/styles/style264.png';
import style265 from '@/public/img/styles/style265.png';
import style266 from '@/public/img/styles/style266.png';
import style267 from '@/public/img/styles/style267.png';
import style268 from '@/public/img/styles/style268.png';
import style269 from '@/public/img/styles/style269.png';
import style270 from '@/public/img/styles/style270.png';
import style271 from '@/public/img/styles/style271.png';
import style273 from '@/public/img/styles/style273.png';
import style274 from '@/public/img/styles/style274.png';
import style275 from '@/public/img/styles/style275.png';
import style276 from '@/public/img/styles/style276.png';
import style277 from '@/public/img/styles/style277.png';
import style278 from '@/public/img/styles/style278.png';
import style279 from '@/public/img/styles/style279.png';
import style280 from '@/public/img/styles/style280.png';
import style281 from '@/public/img/styles/style281.png';
import style282 from '@/public/img/styles/style282.png';
import style283 from '@/public/img/styles/style283.png';
import style284 from '@/public/img/styles/style284.png';
import style285 from '@/public/img/styles/style285.png';
import style286 from '@/public/img/styles/style286.png';
import style287 from '@/public/img/styles/style287.png';
import style288 from '@/public/img/styles/style288.png';
import style289 from '@/public/img/styles/style289.png';
import style290 from '@/public/img/styles/style290.png';
import style291 from '@/public/img/styles/style291.png';
import style47 from '@/public/img/styles/style47.png';
import style36 from '@/public/img/styles/style36.png';

interface ICombatStyleSelectRenderData {
  image: StaticImageData;
}

const CombatStyleSelectRenderData: { [k in EquipmentCategory]: RenderData<string, ICombatStyleSelectRenderData> } = {
  [EquipmentCategory.BLASTER]: {
    Flamer: { image: style36 },
    Explosive: { image: style47 },
  },
  [EquipmentCategory.GUN]: {
    'Aim and Fire': { image: style128 },
  },
  [EquipmentCategory.MULTI_MELEE]: {
    Poke: { image: style254 },
    Slash: { image: style256 },
    Pound: { image: style255 },
    Block: { image: style253 },
  },
  [EquipmentCategory.AXE]: {
    Block: { image: style233 },
    Chop: { image: style234 },
    Hack: { image: style235 },
    Smash: { image: style236 },
  },
  [EquipmentCategory.TWO_HANDED_SWORD]: {
    Block: { image: style237 },
    Smash: { image: style238 },
    Slash: { image: style238 },
    Chop: { image: style239 },
  },
  [EquipmentCategory.PARTISAN]: {
    Block: { image: style237 },
    Pound: { image: style238 },
    Lunge: { image: style239 },
    Stab: { image: style240 },
  },
  [EquipmentCategory.SLASH_SWORD]: {
    Block: { image: style237 },
    Slash: { image: style238 },
    Chop: { image: style239 },
    Lunge: { image: style240 },
  },
  [EquipmentCategory.STAB_SWORD]: {
    Block: { image: style237 },
    Slash: { image: style238 },
    Lunge: { image: style239 },
    Stab: { image: style240 },
  },
  [EquipmentCategory.BANNER]: {
    Lunge: { image: style241 },
    Pound: { image: style242 },
    Block: { image: style250 },
    Swipe: { image: style251 },
  },
  [EquipmentCategory.SPEAR]: {
    Lunge: { image: style241 },
    Pound: { image: style242 },
    Block: { image: style250 },
    Swipe: { image: style251 },
  },
  [EquipmentCategory.SPIKED]: {
    Block: { image: style243 },
    Pummel: { image: style244 },
    Spike: { image: style245 },
    Pound: { image: style246 },
  },
  [EquipmentCategory.UNARMED]: {
    Punch: { image: style247 },
    Kick: { image: style248 },
    Block: { image: style249 },
  },
  [EquipmentCategory.STAFF]: {
    Focus: { image: style252 },
    Bash: { image: style266 },
    Pound: { image: style267 },
  },
  [EquipmentCategory.BLADED_STAFF]: {
    Fend: { image: style252 },
    Jab: { image: style266 },
    Swipe: { image: style267 },
  },
  [EquipmentCategory.POLESTAFF]: {
    Block: { image: style252 },
    Bash: { image: style266 },
    Pound: { image: style267 },
  },
  [EquipmentCategory.BLUDGEON]: {
    Smash: { image: style253 },
    Pound: { image: style255 },
    Pummel: { image: style256 },
  },
  [EquipmentCategory.BLUNT]: {
    Block: { image: style253 },
    Pound: { image: style255 },
    Pummel: { image: style256 },
  },
  [EquipmentCategory.BULWARK]: {
    Block: { image: style253 },
    Pummel: { image: style254 },
  },
  [EquipmentCategory.CROSSBOW]: {
    Accurate: { image: style258 },
    Rapid: { image: style259 },
    Longrange: { image: style260 },
  },
  [EquipmentCategory.SCYTHE]: {
    Block: { image: style261 },
    Chop: { image: style262 },
    Reap: { image: style271 },
    Jab: { image: style271 },
  },
  [EquipmentCategory.POWERED_STAFF]: {
    Accurate: { image: style263 },
    Longrange: { image: style265 },
  },
  [EquipmentCategory.POWERED_WAND]: {
    Accurate: { image: style263 },
    Longrange: { image: style265 },
  },
  [EquipmentCategory.THROWN]: {
    Accurate: { image: style263 },
    Rapid: { image: style264 },
    Longrange: { image: style265 },
  },
  [EquipmentCategory.BOW]: {
    Accurate: { image: style268 },
    Rapid: { image: style269 },
    Longrange: { image: style270 },
  },
  [EquipmentCategory.PICKAXE]: {
    Block: { image: style273 },
    Spike: { image: style274 },
    Smash: { image: style275 },
    Impale: { image: style276 },
  },
  [EquipmentCategory.CLAW]: {
    Lunge: { image: style277 },
    Slash: { image: style278 },
    Chop: { image: style279 },
    Block: { image: style280 },
  },
  [EquipmentCategory.CHINCHOMPA]: {
    'Long fuse': { image: style281 },
    'Medium fuse': { image: style282 },
    'Short fuse': { image: style288 },
  },
  [EquipmentCategory.POLEARM]: {
    Fend: { image: style283 },
    Jab: { image: style284 },
    Swipe: { image: style285 },
  },
  [EquipmentCategory.WHIP]: {
    Flick: { image: style286 },
    Deflect: { image: style286 },
    Lash: { image: style287 },
  },
  [EquipmentCategory.SALAMANDER]: {
    Scorch: { image: style289 },
    Flare: { image: style290 },
    Blaze: { image: style291 },
  },
  [EquipmentCategory.DAGGER]: {},
  [EquipmentCategory.NONE]: {
    Punch: { image: style247 },
    Kick: { image: style248 },
    Block: { image: style249 },
  },
};

const ManualCastRenderData: ICombatStyleSelectRenderData = {
  image: style247,
};

const CombatStyleOption: React.FC<{ category: EquipmentCategory, style: PlayerCombatStyle }> = observer(({ category, style }) => {
  const { basePlayer, updateBasePlayer } = usePlayer();

  const image = style.stance === 'Manual Cast'
    ? ManualCastRenderData.image
    : CombatStyleSelectRenderData[category]?.[style.name]?.image;

  const [hovering, setHovering] = useState(false);
  const isActive = basePlayer.style.name === style.name;

  return (
    <button
      type="button"
      className="flex gap-4 items-center text-sm p-2 px-6 text-left transition-[background] first:border-t border-b text-black border-body-200 dark:border-dark-400 bg-gray-100 dark:bg-dark-500 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-400"
      onClick={() => updateBasePlayer({ style })}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="h-[15px] w-[15px] flex justify-center">
        {image && <Image className="w-full h-full object-contain" src={image} alt={style.name} />}
      </div>
      <div>
        <div className="font-bold font-serif">
          {style.name}
        </div>
        <div className="text-xs capitalize">
          {style.type ?? 'None'}
          ,
          {' '}
          {style.stance ?? 'None'}
        </div>
      </div>
      {(hovering || isActive) && (
        <div className="ml-auto">
          {isActive ? <IconCircleCheckFilled className="text-green-400 dark:text-green-200" />
            : <IconCircleCheck className="text-gray-300" />}
        </div>
      )}
    </button>
  );
});

const CombatStyleSelector: React.FC = observer(() => {
  const { basePlayer } = usePlayer();
  const category = basePlayer.equipment.weapon?.category ?? EquipmentCategory.NONE;
  const availableStyles = getCombatStylesForCategory(category);

  return (
    <div className="flex flex-col my-4">
      {availableStyles.map((style) => <CombatStyleOption key={style.name} category={category} style={style} />)}
    </div>
  );
});

export default CombatStyleSelector;
