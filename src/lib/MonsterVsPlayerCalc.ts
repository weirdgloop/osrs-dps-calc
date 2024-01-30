import BaseCalc, { CalcOpts } from '@/lib/BaseCalc';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';

/**
 * Class for computing various monster versus player metrics.
 */
export default class MonsterVsPlayerCalc extends BaseCalc {
  constructor(player: Player, monster: Monster, opts: Partial<CalcOpts> = {}) {
    super(player, monster, opts);
  }
}
