import { Player } from '@/types/Player';
import {
  autorun, makeAutoObservable, makeObservable, observable, action,
} from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { test } from '@jest/globals';
import { findEquipment, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import { calculateEquipmentBonusesFromGear } from '@/lib/Equipment';
import { Monster } from '../types/Monster';

class State {
  constructor(
    public readonly monster: Monster,
    public readonly player: Player,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  updateMonster(monster: PartialDeep<Monster>) {
    merge(this.monster, monster, (obj, src) => {
      // This check is to ensure that empty arrays always override existing arrays, even if they have values.
      if (Array.isArray(src) && src.length === 0) {
        return src;
      }
      return undefined;
    });
  }

  updatePlayer(player: PartialDeep<Player>) {
    merge(this.player, player);

    const newBonuses = calculateEquipmentBonusesFromGear(this.player, this.monster);
    merge(this.player, newBonuses.bonuses);
  }
}

test('mobx test', () => {
  const monster = getTestMonster('Verzik Vitur', 'Normal mode, Phase 2');
  const player = getTestPlayer(monster, {});
  const state = new State(monster, player);

  const t = { x: 'a' };
  makeAutoObservable(t, {}, { autoBind: true });

  autorun(() => {
    const calc = new PlayerVsNPCCalc(state.player, state.monster);
    console.log(calc.getDps());
  });

  autorun(() => console.log(t.x));
  t.x = 'b';

  state.updatePlayer({ skills: { str: 118 } });
  state.updatePlayer({
    equipment: {
      weapon: findEquipment('Scythe of vitur', 'Charged'),
    },
  });
});

test('3', () => {
  class TTTT {
    x: number = 0;

    y: number = 1;

    constructor() {
      makeObservable<TTTT>(this, { x: observable, updateX: action, updateY: action }, { autoBind: true });
      autorun(() => console.log({ x: this.x }));
      autorun(() => console.log({ y: this.y }));
    }

    updateX() {
      this.x += 1;
    }

    updateY() {
      this.y += 1;
    }
  }

  const t = new TTTT();
  t.updateX();
  t.updateY();
});
