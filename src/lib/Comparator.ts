import { Player, PlayerSkills } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { scaleMonster, scaleMonsterHpOnly } from '@/lib/MonsterScaling';
import { max } from 'd3-array';
import { keys, typedMerge } from '@/utils';
import { CalcOpts } from '@/lib/BaseCalc';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { ChartAnnotation, ChartEntry } from '@/types/State';
import { DPS_PRECISION } from '@/lib/constants';

export enum CompareXAxis {
  MONSTER_DEF,
  MONSTER_MAGIC,
  MONSTER_HP,
  PLAYER_ATTACK_LEVEL,
  PLAYER_STRENGTH_LEVEL,
  PLAYER_RANGED_LEVEL,
  PLAYER_MAGIC_LEVEL,
  STAT_DECAY_RESTORE,
  PLAYER_DEFENCE_LEVEL,
}

export enum CompareYAxis {
  PLAYER_DPS,
  PLAYER_EXPECTED_HIT,
  MONSTER_DPS,
  DAMAGE_TAKEN,
  PLAYER_TTK,
  PLAYER_MAX_HIT,
}

interface InputSet {
  xValue: number,
  loadouts: Player[],
  monster: Monster,
}

export interface CompareResult {
  entries: ChartEntry[],
  annotations: {
    x: ChartAnnotation[],
    y: ChartAnnotation[],
  },
  domainMax: number,
}

export default class Comparator {
  private readonly baseLoadouts: Player[];

  private readonly baseMonster: Monster;

  private readonly xAxis: CompareXAxis;

  private readonly yAxis: CompareYAxis;

  private readonly commonOpts: CalcOpts;

  constructor(players: Player[], monster: Monster, xAxis: CompareXAxis, yAxis: CompareYAxis) {
    this.baseLoadouts = players;
    this.baseMonster = scaleMonster(monster);
    this.xAxis = xAxis;
    this.yAxis = yAxis;

    this.commonOpts = {
      disableMonsterScaling: true,
    };
  }

  private* inputsIterator(): Generator<InputSet> {
    const monsterInput = (x: number, alterations: PartialDeep<Monster>): InputSet => ({
      xValue: x,
      loadouts: this.baseLoadouts,
      monster: typedMerge(
        this.baseMonster,
        alterations,
      ),
    });

    const playerInput = (x: number, alterations: PartialDeep<Player>): InputSet => ({
      xValue: x,
      loadouts: this.baseLoadouts.map((p) => typedMerge(
        p,
        alterations,
      )),
      monster: this.baseMonster,
    });

    const skillInput = (x: number, stat: keyof PlayerSkills): InputSet => playerInput(x, { skills: { [stat]: x }, boosts: { [stat]: 0 } });

    switch (this.xAxis) {
      case CompareXAxis.MONSTER_DEF:
        for (let newDef = this.baseMonster.skills.def; newDef >= 0; newDef--) {
          yield monsterInput(newDef, { skills: { def: newDef } });
        }
        return;

      case CompareXAxis.MONSTER_MAGIC:
        for (let newMagic = this.baseMonster.skills.magic; newMagic >= 0; newMagic--) {
          yield monsterInput(newMagic, { skills: { magic: newMagic } });
        }
        return;

      case CompareXAxis.MONSTER_HP: {
        for (let newHp = this.baseMonster.skills.hp; newHp >= 0; newHp--) {
          yield {
            xValue: newHp,
            loadouts: this.baseLoadouts,
            monster: scaleMonsterHpOnly(
              merge(
                this.baseMonster,
                { inputs: { monsterCurrentHp: newHp } },
              ),
            ),
          };
        }
        return;
      }

      case CompareXAxis.PLAYER_ATTACK_LEVEL:
        for (let newAttack = 0; newAttack <= 125; newAttack++) {
          yield skillInput(newAttack, 'atk');
        }
        return;

      case CompareXAxis.PLAYER_STRENGTH_LEVEL:
        for (let newStrength = 0; newStrength <= 125; newStrength++) {
          yield skillInput(newStrength, 'str');
        }
        return;

      case CompareXAxis.PLAYER_DEFENCE_LEVEL:
        for (let newDefence = 0; newDefence <= 125; newDefence++) {
          yield skillInput(newDefence, 'def');
        }
        return;

      case CompareXAxis.PLAYER_RANGED_LEVEL:
        for (let newRanged = 0; newRanged <= 125; newRanged++) {
          yield skillInput(newRanged, 'ranged');
        }
        return;

      case CompareXAxis.PLAYER_MAGIC_LEVEL:
        for (let newMagic = 0; newMagic <= 125; newMagic++) {
          yield skillInput(newMagic, 'magic');
        }
        return;

      case CompareXAxis.STAT_DECAY_RESTORE: {
        const limit = max(this.baseLoadouts, (l) => max(keys(l.boosts), (k) => Math.abs(l.boosts[k]))) || 0;
        for (let restore = 0; restore <= limit; restore++) {
          const restoredLoadouts = this.baseLoadouts.map((p) => {
            const newBoosts: PlayerSkills = {} as PlayerSkills;
            keys(p.boosts).forEach((k) => {
              const boost = p.boosts[k];
              const distFromZero = Math.abs(boost);
              if (restore >= distFromZero) {
                newBoosts[k] = 0;
              } else {
                newBoosts[k] = Math.sign(boost) * (distFromZero - restore);
              }
            });
            return typedMerge(p, { boosts: newBoosts });
          });

          yield {
            xValue: restore,
            loadouts: restoredLoadouts,
            monster: this.baseMonster,
          };
        }
        return;
      }

      default:
        throw new Error(`unimplemented xAxisType ${this.xAxis}`);
    }
  }

  private getOutput(x: InputSet): { [loadout: string]: string | undefined } {
    const res: { [loadout: string]: string | undefined } = {};
    const apply = (resultProvider: (loadout: Player) => string | undefined) => x.loadouts.forEach((l) => {
      res[l.name] = resultProvider(l);
    });

    const forwardCalc = (loadout: Player) => new PlayerVsNPCCalc(loadout, x.monster, this.commonOpts);
    const reverseCalc = (loadout: Player) => new NPCVsPlayerCalc(loadout, x.monster, this.commonOpts);

    switch (this.yAxis) {
      case CompareYAxis.PLAYER_DPS:
        apply((l) => forwardCalc(l).getDps().toFixed(DPS_PRECISION));
        break;

      case CompareYAxis.PLAYER_EXPECTED_HIT:
        apply((l) => forwardCalc(l).getDistribution().getExpectedDamage().toFixed(DPS_PRECISION));
        break;

      case CompareYAxis.PLAYER_TTK:
        apply((l) => forwardCalc(l).getTtk()?.toFixed(DPS_PRECISION));
        break;

      case CompareYAxis.MONSTER_DPS:
        apply((l) => reverseCalc(l).getDps().toFixed(DPS_PRECISION));
        break;

      case CompareYAxis.DAMAGE_TAKEN:
        apply((l) => reverseCalc(l).getAverageDamageTaken()?.toFixed(DPS_PRECISION));
        break;

      case CompareYAxis.PLAYER_MAX_HIT:
        apply((l) => forwardCalc(l).getMax().toString());
        break;

      default:
        throw new Error(`unimplemented yAxisType ${this.yAxis}`);
    }

    return res;
  }

  public getAnnotationsX(): ChartAnnotation[] {
    if (this.xAxis === CompareXAxis.MONSTER_DEF) {
      const annotations: ChartAnnotation[] = [];
      let currentDef = this.baseMonster.skills.def;
      let dwhCount = 1;
      while (currentDef >= 100) {
        currentDef -= Math.trunc(currentDef * 3 / 10);
        annotations.push({
          label: `DWH x${dwhCount}`,
          value: currentDef,
        });
        dwhCount += 1;
      }

      currentDef = this.baseMonster.skills.def;
      let elderMauls = 1;
      while (currentDef >= 100) {
        currentDef -= Math.trunc(currentDef * 35 / 100);
        annotations.push({
          label: `Elder Maul x${elderMauls}`,
          value: currentDef,
        });
        elderMauls += 1;
      }

      return annotations;
    }

    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  public getAnnotationsY(): ChartAnnotation[] {
    return [];
  }

  public getEntries(): [ChartEntry[], number] {
    let domainMax: number = 0;

    const res: ChartEntry[] = [];
    for (const x of this.inputsIterator()) {
      const y = this.getOutput(x);
      for (const k of keys(y)) {
        const f = y[k] ? parseFloat(y[k]!) : 0;
        if (f > domainMax) {
          domainMax = f;
        }
      }

      res.push({
        ...y,
        name: x.xValue,
      });
    }

    return [res, domainMax];
  }
}
