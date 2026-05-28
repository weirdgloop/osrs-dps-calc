'use client';

import {
  autorun, IReactionDisposer, makeAutoObservable, runInAction,
} from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import {
  createDefaultPlayer,
  createDefaultPlayerDerived,
  EquipmentPiece,
  EquipmentSlot,
  ManualModeDerivedOverrides,
  Player,
  PlayerBase,
  PlayerDerived,
  PlayerSkill,
  PlayerSkills,
} from '@/types/Player';
import { MERGE_OVERWRITE_ARRAYS, toggleArrayMembership } from '@/utils';
import { PreferencesStore } from '@/state/Preferences';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_PROXY } from '@/app/UIConstants';
import {
  ARM_PRAYERS,
  BRAIN_PRAYERS,
  DEFENSIVE_PRAYERS,
  OFFENSIVE_PRAYERS,
  OVERHEAD_PRAYERS,
  Prayer,
} from '@/enums/Prayer';
import { EquipmentPreset, EquipmentPresetValues } from '@/types/EquipmentPreset';
import {
  dbrowDefinitions,
  rootNode,
} from '@/app/components/player/demonicPactsLeague/pactSelector/parse_skill_tree_elements';
import CalcWorker from '@/worker/CalcWorker';
import { MonsterStore } from '@/state/MonsterStore';
import { WorkerRequestType } from '@/worker/CalcWorkerTypes';
import { CalcResults, CalcState } from '@/types/Results';

class PlayerStore {
  private static SELF_ID: number = 1;

  readonly loadoutId: number;

  basePlayer: PlayerBase;

  manualModeDerivedInputs: ManualModeDerivedOverrides;

  private _isLoadingPlayerSkills: boolean = false;

  private hoveredNodeId: string | null = null;

  readonly results: CalcResults = {
    basic: { state: CalcState.NOT_APPLICABLE },
    reverse: { state: CalcState.NOT_APPLICABLE },
    ttk: { state: CalcState.NOT_APPLICABLE },
  };

  readonly #reactionDisposers: IReactionDisposer[] = [];

  #worker?: CalcWorker;

  #ttkWorker?: CalcWorker;

  constructor(
    private readonly preferencesStore: PreferencesStore,
    private readonly monsterStore: MonsterStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.loadoutId = PlayerStore.SELF_ID;
    PlayerStore.SELF_ID += 1;

    this.basePlayer = createDefaultPlayer(`Loadout ${this.loadoutId}`);
    this.manualModeDerivedInputs = createDefaultPlayerDerived();
  }

  public startUp() {
    this.#worker = new CalcWorker();
    this.#worker.initWorker();

    this.#ttkWorker = new CalcWorker();
    this.#ttkWorker.initWorker();

    // this is verbose, but whatever, the type narrowing just makes it hard to condense cleanly
    console.warn(`registering autorun for ${this.loadoutId}`);
    this.#reactionDisposers.push(autorun(() => {
      runInAction(() => {
        this.updateResults({
          basic: { state: CalcState.PENDING },
          reverse: { state: CalcState.PENDING },
          ttk: { state: CalcState.PENDING },
        });
      });

      console.warn(`autorunning for ${this.loadoutId}`);
      const { monster } = this.monsterStore;
      const { player } = this;
      this.#worker?.do({
        type: WorkerRequestType.COMPUTE_BASIC,
        data: {
          player,
          monster,
          calcOpts: {},
        },
      }).then((res) => {
        this.updateResults({ basic: res.payload });
      }).catch((err) => {
        this.updateResults({ basic: { state: CalcState.FAILED, error: err.message } });
      });

      if (this.preferencesStore.showNPCVersusPlayerResults) {
        this.#worker?.do({
          type: WorkerRequestType.COMPUTE_REVERSE,
          data: {
            player,
            monster,
            calcOpts: {},
          },
        }).then((res) => {
          this.updateResults({ reverse: res.payload });
        }).catch((err) => {
          this.updateResults({ reverse: { state: CalcState.FAILED, error: err.message } });
        });
      }

      if (this.preferencesStore.showTtkComparison) {
        this.#ttkWorker?.do({
          type: WorkerRequestType.COMPUTE_TTK,
          data: {
            player,
            monster,
            calcOpts: {},
          },
        }).then((res) => {
          this.updateResults({ ttk: res.payload });
        }).catch((err) => {
          this.updateResults({ ttk: { state: CalcState.FAILED, error: err.message } });
        });
      }
    }));
  }

  public shutDown() {
    this.#reactionDisposers.forEach((d) => d());
    this.#worker?.shutDown();
    this.#ttkWorker?.shutDown();
  }

  get derivedPlayerWithoutOverrides(): PlayerDerived {
    // todo(mobx): apply potions and stuff
    return {
      ...this.manualModeDerivedInputs,
      leagues: {
        six: {
          effects: {},
        },
      },
    };
  }

  get derivedPlayer(): PlayerDerived {
    if (this.preferencesStore.manualMode) {
      return merge({}, this.derivedPlayerWithoutOverrides, this.manualModeDerivedInputs, MERGE_OVERWRITE_ARRAYS);
    }

    return this.derivedPlayerWithoutOverrides;
  }

  get player(): Player {
    // merge modifies the objects, so we write into a blank object
    return merge({}, this.basePlayer, this.derivedPlayer, MERGE_OVERWRITE_ARRAYS);
  }

  get isLoadingPlayerSkills(): boolean {
    return this._isLoadingPlayerSkills;
  }

  get combatLevel(): number {
    // boosts do not affect combat level
    const s = this.basePlayer.skills;

    const baseLevel = 0.25 * (s.def + s.hp + Math.floor(s.prayer / 2));
    const meleeCbLevel = 0.325 * (s.atk + s.str);
    const magicCbLevel = 0.325 * (Math.floor(s.magic / 2) + s.magic);
    const rangedCbLevel = 0.325 * (Math.floor(s.ranged / 2) + s.ranged);
    const cbType = Math.max(meleeCbLevel, Math.max(magicCbLevel, rangedCbLevel));
    const cbLevelDouble = baseLevel + cbType;

    // Return the combat level
    return Math.floor(cbLevelDouble);
  }

  get currentEffects(): Map<
  string,
  {
    skillTreeNodeId: string;
    values: number[];
  }
  > {
    const state = this.basePlayer.leagues.six;
    const effects = new Map<
    string,
    {
      skillTreeNodeId: string;
      values: number[];
    }
    >();
    for (const id of state.selectedNodeIds) {
      const node = dbrowDefinitions[id];
      if (node) {
        const existingEffect = effects.get(node.effect.name);
        if (existingEffect) {
          if (dbrowDefinitions[existingEffect.skillTreeNodeId]?.name.length < node.name.length) {
            existingEffect.skillTreeNodeId = id;
          }
          existingEffect.values.push(node.effect.value);
        } else {
          effects.set(node.effect.name, {
            skillTreeNodeId: id,
            values: [node.effect.value],
          });
        }
      }
    }
    return effects;
  }

  public updateBasePlayer(newValues: PartialDeep<Player>) {
    merge(this.basePlayer, newValues, MERGE_OVERWRITE_ARRAYS);
  }

  public updateManualModeDerivedInputs(newValues: PartialDeep<PlayerDerived>) {
    merge(this.manualModeDerivedInputs, newValues, MERGE_OVERWRITE_ARRAYS);
  }

  public updateResults(newValues: PartialDeep<CalcResults>) {
    merge(this.results, newValues, MERGE_OVERWRITE_ARRAYS);
  }

  public equipPreset(preset: EquipmentPreset) {
    const { loadoutName, equipment } = EquipmentPresetValues[preset];
    this.basePlayer.name = loadoutName;
    Object.entries(equipment).forEach(([slot, eq]) => {
      this.basePlayer.equipment[slot as EquipmentSlot] = eq;
    });
  }

  public toggleInBlindbag(blindbagItem: EquipmentPiece) {
    toggleArrayMembership(this.basePlayer.leagues.six.blindbagWeapons, blindbagItem, (eq) => eq.id === blindbagItem.id);
  }

  public togglePrayer(prayer: Prayer) {
    // if the prayer is already on then we don't need to do any conflict checking
    if (this.basePlayer.prayers.includes(prayer)) {
      this.basePlayer.prayers = this.basePlayer.prayers.filter((p) => p !== prayer);
      return;
    }

    let newPrayers: Prayer[] = this.basePlayer.prayers;

    // If this is a defensive prayer, disable all other defensive prayers
    if (DEFENSIVE_PRAYERS.includes(prayer)) newPrayers = newPrayers.filter((p) => !DEFENSIVE_PRAYERS.includes(p));

    // If this is an overhead prayer, disable all other overhead prayers
    if (OVERHEAD_PRAYERS.includes(prayer)) newPrayers = newPrayers.filter((p) => !OVERHEAD_PRAYERS.includes(p));

    // If this is an offensive prayer...
    if (OFFENSIVE_PRAYERS.includes(prayer)) {
      newPrayers = newPrayers.filter((p) => {
        // If this is a "brain" prayer, it can only be paired with arm prayers
        if (BRAIN_PRAYERS.includes(prayer)) return !OFFENSIVE_PRAYERS.includes(p) || ARM_PRAYERS.includes(p);
        // If this is an "arm" prayer, it can only be paired with brain prayers
        if (ARM_PRAYERS.includes(prayer)) return !OFFENSIVE_PRAYERS.includes(p) || BRAIN_PRAYERS.includes(p);
        // Otherwise, there are no offensive prayers it can be paired with, disable them all
        return !OFFENSIVE_PRAYERS.includes(p);
      });
    }

    newPrayers.push(prayer);
    this.basePlayer.prayers = newPrayers;
  }

  public resetManualModeEquipmentBonuses() {
    this.manualModeDerivedInputs = merge({}, {
      offensive: this.derivedPlayerWithoutOverrides.offensive,
      defensive: this.derivedPlayerWithoutOverrides.defensive,
      bonuses: this.derivedPlayerWithoutOverrides.bonuses,
    });
  }

  public async loadPlayerSkills(username: string) {
    try {
      const newSkills = await toast.promise(
        async (): Promise<PlayerSkills> => {
          const sanitizedUsername = username.replaceAll(' ', '_');
          const res = await axios.get<string>(`${API_PROXY}/m=hiscore_oldschool/index_lite.ws?player=${sanitizedUsername}`);

          // The Hiscores API returns in a CSV format, rather than JSON, so we need to do some manual parsing here
          const rawData = res.data.split('\n');
          const skillData = rawData.map((v) => {
            const d = v.split(',');
            // todo(mobx): remove rank and xp?
            return { rank: parseInt(d[0]), level: parseInt(d[1]), xp: parseInt(d[2]) };
          });

          return {
            [PlayerSkill.ATTACK]: skillData[1].level,
            [PlayerSkill.DEFENCE]: skillData[2].level,
            [PlayerSkill.STRENGTH]: skillData[3].level,
            [PlayerSkill.HITPOINTS]: skillData[4].level,
            [PlayerSkill.RANGED]: skillData[5].level,
            [PlayerSkill.PRAYER]: skillData[6].level,
            [PlayerSkill.MAGIC]: skillData[7].level,
            [PlayerSkill.MINING]: skillData[15].level,
            [PlayerSkill.HERBLORE]: skillData[16].level,
          };
        },
        {
          pending: 'Fetching player skills...',
          success: `Successfully fetched player skills for ${username}!`,
          error: 'Error fetching player skills',
        },
        {
          toastId: 'skills-fetch',
        },
      );

      if (newSkills) this.updateBasePlayer({ skills: newSkills });
    } catch (e) {
      console.error(e);
    } finally {
      runInAction(() => {
        this._isLoadingPlayerSkills = false;
      });
    }
  }

  get reachableNodeIds() {
    const reachable = new Set<string>();
    for (const selectedId of this.basePlayer.leagues.six.selectedNodeIds) {
      const node = dbrowDefinitions[selectedId];
      if (node) {
        for (const linkedId of node.linked_nodes) {
          if (!this.basePlayer.leagues.six.selectedNodeIds.has(linkedId)) {
            reachable.add(linkedId);
          }
        }
      }
    }
    return reachable;
  }

  isNodeSelected(id: string) {
    return this.basePlayer.leagues.six.selectedNodeIds.has(id);
  }

  pathToSelection(id: string) {
    const nodesToSelect = this.getNodesToSelect(id);
    for (const nodeId of nodesToSelect) {
      this.basePlayer.leagues.six.selectedNodeIds.add(nodeId);
    }
  }

  private pruneStrandedNodes() {
    if (this.basePlayer.leagues.six.selectedNodeIds.size === 1) {
      return;
    }

    const visited = new Set<string>([rootNode.id]);
    const queue: string[] = [rootNode.id];

    let head = 0;
    while (head < queue.length) {
      const currentId = queue[head];
      head += 1;
      const node = dbrowDefinitions[currentId];
      if (node) {
        for (const linkedId of node.linked_nodes) {
          if (this.basePlayer.leagues.six.selectedNodeIds.has(linkedId) && !visited.has(linkedId)) {
            visited.add(linkedId);
            queue.push(linkedId);
          }
        }
      }
    }

    this.basePlayer.leagues.six.selectedNodeIds = visited;
  }

  public toggleNodeSelection(id: string, allowMissingDependencies: boolean) {
    if (id === rootNode.id) {
      this.basePlayer.leagues.six.selectedNodeIds.clear();
      this.basePlayer.leagues.six.selectedNodeIds.add(rootNode.id);
      return;
    }

    if (this.basePlayer.leagues.six.selectedNodeIds.has(id)) {
      this.basePlayer.leagues.six.selectedNodeIds.delete(id);
      if (!allowMissingDependencies) {
        this.pruneStrandedNodes();
      }
    } else if (this.reachableNodeIds.has(id) || allowMissingDependencies) {
      this.basePlayer.leagues.six.selectedNodeIds.add(id);
    } else {
      this.pathToSelection(id);
    }
  }

  getNodesToSelect(id: string): Set<string> {
    const nodesToSelect = new Set<string>();
    if (this.basePlayer.leagues.six.selectedNodeIds.has(id)) {
      return nodesToSelect;
    }

    const queue: string[] = [id];
    const parent = new Map<string, string | null>();
    parent.set(id, null);

    let foundTarget: string | null = null;
    let head = 0;

    const isTarget = (nodeId: string): boolean => this.basePlayer.leagues.six.selectedNodeIds.has(nodeId);

    while (head < queue.length) {
      const currentId = queue[head];
      head += 1;
      if (isTarget(currentId)) {
        foundTarget = currentId;
        break;
      }

      const node = dbrowDefinitions[currentId];
      if (node) {
        for (const linkedId of node.linked_nodes) {
          if (!parent.has(linkedId)) {
            parent.set(linkedId, currentId);
            queue.push(linkedId);
          }
        }
      }
    }

    if (foundTarget) {
      let curr: string | null = foundTarget;
      while (curr !== null) {
        if (!this.basePlayer.leagues.six.selectedNodeIds.has(curr)) {
          nodesToSelect.add(curr);
        }
        curr = parent.get(curr) || null;
      }
    }

    return nodesToSelect;
  }

  get nodesToSelectIfHoveredSelected(): Set<string> {
    if (!this.hoveredNodeId) {
      return new Set();
    }
    return this.getNodesToSelect(this.hoveredNodeId);
  }

  setHoveredNode(id: string | null) {
    this.hoveredNodeId = id;
  }
}

export default PlayerStore;
