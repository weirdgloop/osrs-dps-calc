import {makeAutoObservable} from 'mobx';
import {Monster} from '@/types/Monster';
import {Player, PlayerBuffs, PlayerSkills} from '@/types/PlayerAttributes';
import React, {createContext, useContext} from 'react';
import {PartialDeep} from 'type-fest';
import {CombatStyle} from '@/lib/enums/CombatStyle';
import {Potion} from '@/lib/enums/Potion';

class GlobalState {
  combatStyle: CombatStyle = CombatStyle.CHOP
  username: string = ''
  playerSkills: PlayerSkills = {
    Attack: 1,
    Defence: 1,
    Hitpoints: 1,
    Magic: 1,
    Prayer: 1,
    Ranged: 1,
    Strength: 1
  }
  playerPrayers: string[] = []
  playerCombatAttributes: Player = {
    bonuses: {
      strength: 0,
      ranged_str: 0,
      magic_str: 0,
      prayer: 0
    },
    defensive: {
      stab: 0,
      slash: 0,
      crush: 0,
      magic: 0,
      ranged: 0
    },
    offensive: {
      stab: 0,
      slash: 0,
      crush: 0,
      magic: 0,
      ranged: 0
    }
  }
  playerBuffs: PlayerBuffs = {
    potions: [],
    onSlayerTask: false,
    inWilderness: false,
    kandarinDiary: false,
  }
  monster: Monster = {
    name: '',
    image: '',
    combat: {
      hp: 0,
      attack: 0,
      strength: 0,
      defence: 0,
      magic: 0,
      ranged: 0
    },
    defensive: {
      stab: 0,
      slash: 0,
      crush: 0,
      magic: 0,
      ranged: 0
    },
    offensive: {
      attack: 0,
      strength: 0,
      magic: 0,
      magic_str: 0,
      ranged: 0,
      ranged_str: 0
    },
    attributes: []
  }

  constructor() {
    makeAutoObservable(this);
  }

  setCombatStyle(style: CombatStyle) {
    this.combatStyle = style;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPlayerSkills(skills: PlayerSkills) {
    this.playerSkills = skills;
  }

  setPlayerBuffs(buffs: PlayerBuffs) {
    this.playerBuffs = buffs;
  }

  updatePlayerBuffs(buffs: PartialDeep<PlayerBuffs>) {
    this.playerBuffs = Object.assign(this.playerBuffs, buffs);
  }

  togglePlayerPotion(potion: Potion) {
    const isToggled = this.playerBuffs.potions.includes(potion);
    if (isToggled) {
      this.playerBuffs.potions = this.playerBuffs.potions.filter((p) => p !== potion);
    } else {
      this.playerBuffs.potions = [...this.playerBuffs.potions, potion];
    }
  }

  setPlayerPrayers(prayers: string[]) {
    this.playerPrayers = prayers;
  }

  togglePlayerPrayer(prayer: string) {
    let prayers = [...this.playerPrayers];
    const existing = prayers.findIndex((p) => p === prayer);

    if (existing > -1) {
      prayers.splice(existing, 1);
    } else {
      prayers.push(prayer);
    }

    this.playerPrayers = Array.from(new Set(prayers));
}

  setPlayerCombatAttributes(attributes: Player) {
    this.playerCombatAttributes = attributes;
  }

  setMonster(monster: Monster) {
    this.monster = monster;
  }

  updateMonster(monster: PartialDeep<Monster>) {
    this.monster = Object.assign(this.monster, monster);
  }
}

const StoreContext = createContext<GlobalState>(new GlobalState());

const StoreProvider: React.FC<{ store: GlobalState, children: any }> = ({ store, children }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  )
}

const useStore = () => {
  return useContext(StoreContext);
}

export { GlobalState, StoreProvider, useStore };