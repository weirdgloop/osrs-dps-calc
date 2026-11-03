import { createContext } from 'react';
import useRequiredContext from '@/state/useRequiredContext';
import {
  makeAutoObservable, observable, reaction, toJS,
} from 'mobx';
import { v7 as uuidv7 } from 'uuid';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import {
  LoadoutId, Player, PlayerEquipment, PlayerSkills,
} from '@/types/Player';
import { Monster } from '@/types/Monster';
import { PlayerCombatStyle } from '@/types/PlayerCombatStyle';
import { Spell } from '@/types/Spell';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import Potion from '@/enums/Potion';
import {
  ARM_PRAYERS, BRAIN_PRAYERS, DEFENSIVE_PRAYERS, OFFENSIVE_PRAYERS, OVERHEAD_PRAYERS, Prayer,
} from '@/enums/Prayer';
import { calculateEquipmentBonusesFromGear, EquipmentBonuses } from '@/lib/Equipment';
import { PreferencesStore } from '@/state/PreferencesStore';
import {
  fetchPlayerSkills, getCombatStylesForCategory, getDefaultCombatStyle, keys, PotionMap,
} from '@/utils';

export type PlayerBuffs = Player['buffs'];

export type PlayerPatch = Omit<PartialDeep<Player>, 'equipment' | 'style' | 'spell' | 'prayers' | 'buffs'> & {
  // prevent propagation of PartialDeep down to these fields which should always be whole
  // i.e. we don't want a partial EquipmentPiece or partial PlayerCombatStyle
  equipment?: Partial<PlayerEquipment>;
  style?: PlayerCombatStyle;
  spell?: Spell | null;
  prayers?: Prayer[];
  buffs?: Partial<PlayerBuffs>;
};

const POTION_BOOSTABLE_SKILLS: readonly (keyof PlayerSkills)[] = [
  'atk', 'def', 'magic', 'prayer', 'ranged', 'str', 'mining', 'herblore', 'farming',
];

const createSkills = (level: number): PlayerSkills => ({
  atk: level,
  def: level,
  hp: level,
  magic: level,
  prayer: level,
  ranged: level,
  str: level,
  mining: level,
  herblore: level,
  farming: level,
});

const createEquipment = (): PlayerEquipment => ({
  head: null,
  cape: null,
  neck: null,
  ammo: null,
  weapon: null,
  body: null,
  shield: null,
  legs: null,
  hands: null,
  feet: null,
  ring: null,
});

const createBuffs = (): PlayerBuffs => ({
  potions: [],
  onSlayerTask: true,
  inWilderness: false,
  kandarinDiary: true,
  chargeSpell: false,
  markOfDarknessSpell: false,
  forinthrySurge: false,
  soulreaperStacks: 5,
  baAttackerLevel: 0,
  chinchompaDistance: 4, // 4 tiles is the optimal range for "medium fuse" (rapid), which is the default selected stance
  usingSunfireRunes: false,
  fragmentOfWind: false,
  fragmentOfWater: false,
  fragmentOfEarth: false,
  fragmentOfFire: false,
});

/**
 * A single player loadout.
 */
export class PlayerStore implements Player {
  readonly uuid: LoadoutId;

  name: string;

  style: PlayerCombatStyle = getDefaultCombatStyle(EquipmentCategory.NONE);

  skills: PlayerSkills = createSkills(99);

  equipment: PlayerEquipment = createEquipment();

  prayers: Prayer[] = [];

  buffs: PlayerBuffs = createBuffs();

  spell: Spell | null = null;

  boostOverrides: Partial<PlayerSkills> = {};

  /**
   * Manual mode equipment totals. null when using computed stats
   */
  manualBonuses: EquipmentBonuses | null = null;

  readonly #monster: Pick<Monster, 'id'>;

  readonly #preferences: Pick<PreferencesStore, 'manualMode'>;

  constructor(
    monster: Pick<Monster, 'id'>,
    preferences: Pick<PreferencesStore, 'manualMode'>,
    name: string,
    uuid: LoadoutId = uuidv7(),
  ) {
    this.uuid = uuid;
    this.name = name;
    this.#monster = monster;
    this.#preferences = preferences;

    makeAutoObservable(this, {
      // these ones are always updated wholesale, don't need to create recursive observables here
      style: observable.ref,
      spell: observable.ref,
      equipment: observable.shallow,
    }, { autoBind: true });
  }

  start(): () => void {
    return reaction(() => this.#preferences.manualMode, (manualMode) => {
      if (!manualMode) {
        this.clearManualBonuses();
      }
    });
  }

  get gearBonuses(): EquipmentBonuses {
    return calculateEquipmentBonusesFromGear(this, this.#monster);
  }

  get equipmentBonuses(): EquipmentBonuses {
    return this.manualBonuses ?? this.gearBonuses;
  }

  get bonuses(): Player['bonuses'] {
    return this.equipmentBonuses.bonuses;
  }

  get offensive(): Player['offensive'] {
    return this.equipmentBonuses.offensive;
  }

  get defensive(): Player['defensive'] {
    return this.equipmentBonuses.defensive;
  }

  get attackSpeed(): number {
    return this.equipmentBonuses.attackSpeed;
  }

  get potionBoosts(): PlayerSkills {
    const boosts = createSkills(0);
    for (const potion of this.buffs.potions) {
      const result = PotionMap[potion].calculateFn(this.skills);
      for (const skill of POTION_BOOSTABLE_SKILLS) {
        boosts[skill] = Math.max(boosts[skill], result[skill] ?? 0);
      }
    }
    return boosts;
  }

  get boosts(): PlayerSkills {
    return { ...this.potionBoosts, ...this.boostOverrides };
  }

  get availableCombatStyles(): PlayerCombatStyle[] {
    return getCombatStylesForCategory(this.equipment.weapon?.category || EquipmentCategory.NONE);
  }

  /**
   * A snapshot of the loadout for conversion out of observable-land
   */
  get snapshot(): Player {
    return {
      uuid: this.uuid,
      name: this.name,
      style: this.style,
      skills: { ...this.skills },
      boosts: this.boosts,
      equipment: { ...this.equipment },
      attackSpeed: this.attackSpeed,
      prayers: [...this.prayers],
      bonuses: { ...this.bonuses },
      offensive: { ...this.offensive },
      defensive: { ...this.defensive },
      buffs: toJS(this.buffs),
      spell: this.spell,
    };
  }

  setName(name: string) {
    this.name = name;
  }

  setStyle(style: PlayerCombatStyle) {
    this.style = style;
  }

  setSpell(spell: Spell | null) {
    this.spell = spell;
  }

  setSkills(skills: Partial<PlayerSkills>) {
    Object.assign(this.skills, skills);
    this.discardNonHpBoostOverrides();
  }

  async fetchSkills(username: string) {
    this.setSkills(await fetchPlayerSkills(username));
  }

  setBoost(skill: keyof PlayerSkills, boost: number) {
    this.boostOverrides[skill] = boost;
  }

  // omit potions so that they have to go through togglePotion
  setBuffs(buffs: Partial<Omit<PlayerBuffs, 'potions'>>) {
    Object.assign(this.buffs, buffs);
  }

  togglePotion(potion: Potion) {
    const { potions } = this.buffs;
    this.buffs.potions = potions.includes(potion)
      ? potions.filter((p) => p !== potion)
      : [...potions, potion];
    this.discardNonHpBoostOverrides();
  }

  togglePrayer(prayer: Prayer) {
    if (this.prayers.includes(prayer)) {
      this.prayers = this.prayers.filter((p) => p !== prayer);
      return;
    }

    let prayers = this.prayers.slice();
    if (DEFENSIVE_PRAYERS.includes(prayer)) {
      prayers = prayers.filter((p) => !DEFENSIVE_PRAYERS.includes(p));
    }
    if (OVERHEAD_PRAYERS.includes(prayer)) {
      prayers = prayers.filter((p) => !OVERHEAD_PRAYERS.includes(p));
    }
    if (OFFENSIVE_PRAYERS.includes(prayer)) {
      prayers = prayers.filter((p) => {
        if (!OFFENSIVE_PRAYERS.includes(p)) return true;
        // "brain" (accuracy) and "arm" (strength) prayers can be paired with each other, but nothing else
        if (BRAIN_PRAYERS.includes(prayer)) return ARM_PRAYERS.includes(p);
        if (ARM_PRAYERS.includes(prayer)) return BRAIN_PRAYERS.includes(p);
        return false;
      });
    }
    this.prayers = [...prayers, prayer];
  }

  setEquipment(equipment: Partial<PlayerEquipment>) {
    const changes = { ...equipment };
    if (changes.weapon?.isTwoHanded) {
      changes.shield = null;
    } else if (changes.shield && (changes.weapon === undefined ? this.equipment.weapon : changes.weapon)?.isTwoHanded) {
      changes.weapon = null;
    }

    const previousCategory = this.equipment.weapon?.category || EquipmentCategory.NONE;
    Object.assign(this.equipment, changes);
    const category = this.equipment.weapon?.category || EquipmentCategory.NONE;
    if (category !== previousCategory) {
      this.style = getDefaultCombatStyle(category);
    }
  }

  setManualBonuses(bonuses: PartialDeep<EquipmentBonuses>) {
    // using this.equipmentBonuses here instead of manualBonuses so that the
    // first edit inherits a clone from the derived stats, skipping the need
    // to manually initialize the whole manualBonuses object on manual mode enable
    this.manualBonuses = merge({}, this.equipmentBonuses, bonuses);
  }

  clearManualBonuses() {
    this.manualBonuses = null;
  }

  private discardNonHpBoostOverrides() {
    const { hp } = this.boostOverrides;
    this.boostOverrides = hp === undefined ? {} : { hp };
  }

  update(patch: PlayerPatch) {
    if (patch.equipment) this.setEquipment(patch.equipment);
    if (patch.name !== undefined) this.name = patch.name;
    if (patch.style) this.style = patch.style;
    if (patch.spell !== undefined) this.spell = patch.spell;
    if (patch.prayers) this.prayers = patch.prayers;
    if (patch.skills) this.setSkills(patch.skills);
    if (patch.buffs) {
      const { potions, ...buffs } = patch.buffs;
      this.setBuffs(buffs);
      if (potions) this.buffs.potions = potions;
    }
    if (patch.boosts) {
      const { potionBoosts } = this;
      const overrides: Partial<PlayerSkills> = {};
      for (const skill of keys(patch.boosts)) {
        const boost = patch.boosts[skill];
        if (boost !== undefined && boost !== potionBoosts[skill]) {
          overrides[skill] = boost;
        }
      }
      this.boostOverrides = overrides;
    }
  }
}

export const createEmptyPlayer = (name = 'Loadout 1'): Player => new PlayerStore({ id: -1 }, { manualMode: false }, name).snapshot;

export const PlayerContext = createContext<PlayerStore | null>(null);

export const usePlayer = () => useRequiredContext(PlayerContext, 'usePlayer');
