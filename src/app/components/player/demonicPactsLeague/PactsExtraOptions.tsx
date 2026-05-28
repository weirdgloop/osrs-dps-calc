import { observer } from 'mobx-react-lite';
import React from 'react';
import { ConditionalKeys } from 'type-fest';
import { EquipmentPiece, LeaguesState } from '@/types/Player';
import { usePlayer } from '@/state/LoadoutStore';
import Toggle from '@/app/components/generic/Toggle';
import NumberInput from '@/app/components/generic/NumberInput';
import { StaticImageData } from 'next/image';
import { getCdnImage, RenderData } from '@/utils';
import culling_spree from '@/public/img/combat_masteries/culling_spree.png';
import ShowIfLeagueEffectEnabled
  from '@/app/components/player/demonicPactsLeague/pactSelector/ShowIfLeagueEffectEnabled';
import EquipmentSelect from '@/app/components/player/equipment/EquipmentSelect';
import { EquipmentCategory } from '@/enums/EquipmentCategory';

interface IPactsOptionsRenderState {
  name: string;
  image?: StaticImageData;
  hint?: string;
  min?: number;
  max?: number;
}

type LeaguesInputs = ConditionalKeys<LeaguesState, number | boolean>;
const PactsOptionsRenderState: RenderData<LeaguesInputs, IPactsOptionsRenderState> = {
  cullingSpree: {
    name: 'Culling Spree',
    image: culling_spree,
  },
  distanceToEnemy: {
    name: 'Distance to enemy (tiles)',
    hint: 'This affects some pacts. When you stand on the tile adjacent to an enemy your distance is 1.',
    min: 1,
    max: 10,
  },
  regenerateMagicBonus: {
    name: 'Regenerate Magic Level Boost',
    hint: 'Number of Magic levels boosted by Regenerate.',
    min: 0,
    max: 10,
  },
  bowHitsWithoutDamage: {
    name: 'Consecutive bow hits',
    hint: 'Number of consecutive bow hits without taking damage. Taking damage halves this number.',
    min: 0,
    max: 50,
  },
};

const PactsToggle: React.FC<{ key: ConditionalKeys<LeaguesState, boolean> }> = observer(({ key }) => {
  const { basePlayer, updateBasePlayer } = usePlayer();

  const renderData = PactsOptionsRenderState[key];
  if (!renderData) {
    throw new Error(`Missing render data for ${key}`);
  }
  const { name, image, hint } = renderData;

  return (
    <Toggle
      checked={basePlayer.leagues.six[key]}
      setChecked={(c) => updateBasePlayer({ leagues: { six: { [key]: c } } })}
      label={(
        <>
          {image && (<img src={image.src} width={18} className="inline-block" alt="" />)}
          {' '}
          {name}
          {' '}
          {hint && (
            <span
              className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
              data-tooltip-id="tooltip"
              data-tooltip-content={hint}
            >
              ?
            </span>
          )}
        </>
      )}
    />
  );
});

const PactsInput: React.FC<{ key: ConditionalKeys<LeaguesState, number> }> = observer(({ key }) => {
  const { basePlayer, updateBasePlayer } = usePlayer();

  const renderData = PactsOptionsRenderState[key];
  if (!renderData) {
    throw new Error(`Missing render data for ${key}`);
  }
  const {
    name, image, hint, min, max,
  } = renderData;

  return (
    <div className="w-full">
      <NumberInput
        className="form-control w-12"
        required
        min={min}
        max={max}
        value={basePlayer.leagues.six[key]}
        onChange={(v) => updateBasePlayer({ leagues: { six: { [key]: v } } })}
      />
      <span className="ml-1 text-sm select-none">
        {image && (<img src={image.src} width={18} className="inline-block" alt="" />)}
        {' '}
        {name}
        {' '}
        {hint && (
          <span
            className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
            data-tooltip-id="tooltip"
            data-tooltip-content={hint}
          >
            ?
          </span>
        )}
      </span>
    </div>
  );
});

const weaponCanBeUsedInBlindbag = (eq: EquipmentPiece): boolean => {
  if (eq.slot !== 'weapon' || eq.weight < 1) {
    return false;
  }

  switch (eq.category) {
    case EquipmentCategory.NONE:
    case EquipmentCategory.TWO_HANDED_SWORD:
    case EquipmentCategory.AXE:
    case EquipmentCategory.BANNER:
    case EquipmentCategory.BLASTER:
    case EquipmentCategory.BLUDGEON:
    case EquipmentCategory.BLUNT:
    case EquipmentCategory.BULWARK:
    case EquipmentCategory.CLAW:
    case EquipmentCategory.DAGGER:
    case EquipmentCategory.MULTI_MELEE:
    case EquipmentCategory.PARTISAN:
    case EquipmentCategory.PICKAXE:
    case EquipmentCategory.POLEARM:
    case EquipmentCategory.POLESTAFF:
    case EquipmentCategory.SCYTHE:
    case EquipmentCategory.SLASH_SWORD:
    case EquipmentCategory.SPEAR:
    case EquipmentCategory.SPIKED:
    case EquipmentCategory.STAB_SWORD:
    case EquipmentCategory.UNARMED:
    case EquipmentCategory.WHIP:
      // case EquipmentCategory.BLADED_STAFF: // todo is this included?
      // case EquipmentCategory.SALAMANDER: // todo
      return true;

    default:
      // these are staves
      // return eq.name === 'Ivandis flail' || eq.name === 'Blisterwood flail';
      return false;
  }
};

const BlindbagSelector = observer(() => {
  const { basePlayer, toggleInBlindbag } = usePlayer();
  const { blindbagWeapons } = basePlayer.leagues.six;

  return (
    <div className="mt-4">
      <h5 className="text-sm font-serif font-bold mb-2">
        Blindbag (
        <span className={blindbagWeapons.length >= 28 ? 'text-red-300' : ''}>{blindbagWeapons.length}</span>
        {' '}
        / 28)
      </h5>
      <div className="flex flex-wrap gap-1 my-2">
        {blindbagWeapons.length ? blindbagWeapons.map((weapon) => (
          <button
            key={weapon.id}
            type="button"
            aria-label={`${weapon.name}${weapon.version ? ` (${weapon.version})` : ''}`}
            className="w-8 h-8 bg-dark-200 border border-dark-400 group rounded flex justify-center p-0.5 cursor-pointer"
            data-tooltip-id="tooltip"
            data-tooltip-content={`${weapon.name}${weapon.version ? ` (${weapon.version})` : ''}`}
            onClick={() => toggleInBlindbag(weapon)}
          >
            <img
              className="group-hover:opacity-50"
              src={getCdnImage(`equipment/${weapon.image}`)}
              alt={weapon.name}
            />
          </button>
        ))
          : (
            <div
              className="w-8 h-8 bg-dark-200 border border-dark-400 group rounded flex justify-center p-0.5 cursor-pointer"
            />
          )}
      </div>
      <EquipmentSelect
        canonicalize={false}
        equipmentFilter={weaponCanBeUsedInBlindbag}
        onSelect={(item) => {
          const current = blindbagWeapons;
          if (item
            && current.length < 28
            && !current.find((w) => w.id === item.id)
          ) {
            toggleInBlindbag(item);
          }
        }}
      />
    </div>
  );
});

const PactsExtraOptions: React.FC = observer(() => (
  <>
    <PactsToggle key="cullingSpree" />
    <PactsInput key="distanceToEnemy" />
    <ShowIfLeagueEffectEnabled
      leaguesEffect="talent_regen_magic_level_boost"
    >
      <PactsInput key="regenerateMagicBonus" />
    </ShowIfLeagueEffectEnabled>
    <ShowIfLeagueEffectEnabled
      leaguesEffects={[
        'talent_bow_min_hit_stacking_increase',
        'talent_bow_max_hit_stacking_increase',
      ]}
    >
      <PactsInput key="bowHitsWithoutDamage" />
    </ShowIfLeagueEffectEnabled>
    <ShowIfLeagueEffectEnabled leaguesEffect="talent_free_random_weapon_attack_chance">
      <BlindbagSelector />
    </ShowIfLeagueEffectEnabled>
  </>
));

export default PactsExtraOptions;
