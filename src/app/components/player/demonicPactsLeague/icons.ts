import { NodeSize } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';
import spriteTiles from '@/app/components/player/demonicPactsLeague/spriteTiles';

export const getBackingIcon = (
  selected: boolean,
  reachable: boolean,
  nodeSize: NodeSize,
) => {
  let variant = '';

  if (!selected && !reachable) {
    variant = '4';
  }

  if (!selected && reachable) {
    variant = '3';
  }

  if (selected) {
    variant = '1';
  }

  let tileset = 'league_6_combat_mastery_large_backing01';

  if (nodeSize === NodeSize.Capstone) {
    tileset = 'league_6_combat_mastery_large_backing02';
  }

  return spriteTiles[`${tileset},${variant}`];
};

export const rowIdToTileInfo: Record<
string,
{ tileset: string; index: number; size: string }
> = {
  // Ranged
  node2: { tileset: 'ranged', index: 9, size: 'large' },
  node3: { tileset: 'ranged', index: 3, size: 'large' },
  node4: { tileset: 'ranged', index: 7, size: 'large' },
  node5: { tileset: 'ranged', index: 13, size: 'large' },
  node14: { tileset: 'ranged', index: 14, size: 'large' },
  node16: { tileset: 'ranged', index: 15, size: 'large' },
  node18: { tileset: 'ranged', index: 8, size: 'large' },
  node20: { tileset: 'ranged', index: 2, size: 'large' },
  node21: { tileset: 'ranged', index: 6, size: 'large' },
  node22: { tileset: 'ranged', index: 12, size: 'large' },
  node38: { tileset: 'ranged', index: 9, size: 'large' },
  node39: { tileset: 'ranged', index: 9, size: 'large' },
  node26: { tileset: 'ranged', index: 0, size: 'large' },
  node28: { tileset: 'ranged', index: 1, size: 'large' },
  node29: { tileset: 'ranged', index: 4, size: 'large' },
  node31: { tileset: 'ranged', index: 5, size: 'large' },
  node32: { tileset: 'ranged', index: 11, size: 'large' },
  node34: { tileset: 'ranged', index: 10, size: 'large' },
  node7: { tileset: 'generic', index: 3, size: 'medium' },
  node13: { tileset: 'generic', index: 2, size: 'medium' },
  node15: { tileset: 'generic', index: 2, size: 'medium' },
  node17: { tileset: 'generic', index: 2, size: 'medium' },
  node19: { tileset: 'generic', index: 2, size: 'medium' },
  node23: { tileset: 'generic', index: 2, size: 'medium' },
  node24: { tileset: 'generic', index: 2, size: 'medium' },
  node25: { tileset: 'generic', index: 2, size: 'medium' },

  // Magic
  node44: { tileset: 'magic', index: 8, size: 'large' },
  node45: { tileset: 'magic', index: 3, size: 'large' },
  node46: { tileset: 'magic', index: 7, size: 'large' },
  node47: { tileset: 'magic', index: 17, size: 'large' },
  node48: { tileset: 'magic', index: 13, size: 'large' },
  node166: { tileset: 'magic', index: 21, size: 'large' },
  node53: { tileset: 'magic', index: 22, size: 'large' },
  node54: { tileset: 'magic', index: 24, size: 'large' },
  node167: { tileset: 'magic', index: 23, size: 'large' },
  node133: { tileset: 'magic', index: 20, size: 'large' },
  node122: { tileset: 'magic', index: 9, size: 'large' },
  node123: { tileset: 'magic', index: 5, size: 'large' },
  node124: { tileset: 'magic', index: 15, size: 'large' },
  node107: { tileset: 'magic', index: 2, size: 'large' },
  node131: { tileset: 'magic', index: 11, size: 'large' },
  node127: { tileset: 'magic', index: 12, size: 'large' },
  node112: { tileset: 'magic', index: 6, size: 'large' },
  node117: { tileset: 'magic', index: 16, size: 'large' },
  node109: { tileset: 'magic', index: 0, size: 'large' },
  node114: { tileset: 'magic', index: 4, size: 'large' },
  node119: { tileset: 'magic', index: 14, size: 'large' },
  node129: { tileset: 'magic', index: 10, size: 'large' },
  node111: { tileset: 'magic', index: 1, size: 'large' },
  node55: { tileset: 'generic', index: 3, size: 'medium' },
  node56: { tileset: 'generic', index: 3, size: 'medium' },
  node57: { tileset: 'generic', index: 3, size: 'medium' },
  node67: { tileset: 'generic', index: 0, size: 'medium' },
  node68: { tileset: 'generic', index: 0, size: 'medium' },
  node69: { tileset: 'generic', index: 0, size: 'medium' },
  node70: { tileset: 'generic', index: 0, size: 'medium' },
  node108: { tileset: 'generic', index: 0, size: 'medium' },
  node113: { tileset: 'generic', index: 0, size: 'medium' },
  node118: { tileset: 'generic', index: 0, size: 'medium' },
  node128: { tileset: 'generic', index: 0, size: 'medium' },

  // Melee
  node74: { tileset: 'melee', index: 16, size: 'large' },
  node71: { tileset: 'melee', index: 2, size: 'large' },
  node72: { tileset: 'melee', index: 12, size: 'large' },
  node73: { tileset: 'melee', index: 6, size: 'large' },
  node43: { tileset: 'melee', index: 8, size: 'large' },
  node146: { tileset: 'melee', index: 17, size: 'large' },
  node79: { tileset: 'melee', index: 13, size: 'large' },
  node162: { tileset: 'melee', index: 9, size: 'large' },
  node165: { tileset: 'melee', index: 3, size: 'large' },
  node157: { tileset: 'melee', index: 7, size: 'large' },
  node80: { tileset: 'melee', index: 17, size: 'large' },
  node139: { tileset: 'melee', index: 1, size: 'large' },
  node142: { tileset: 'melee', index: 11, size: 'large' },
  node150: { tileset: 'melee', index: 5, size: 'large' },
  node153: { tileset: 'melee', index: 15, size: 'large' },
  node141: { tileset: 'melee', index: 0, size: 'large' },
  node144: { tileset: 'melee', index: 10, size: 'large' },
  node152: { tileset: 'melee', index: 4, size: 'large' },
  node155: { tileset: 'melee', index: 14, size: 'large' },

  // Generic
  node1: { tileset: 'generic', index: 8, size: 'large' },
  node9: { tileset: 'generic', index: 12, size: 'large' },
  node10: { tileset: 'generic', index: 8, size: 'large' },
  node11: { tileset: 'generic', index: 12, size: 'large' },
  node12: { tileset: 'generic', index: 5, size: 'large' },
  node27: { tileset: 'generic', index: 10, size: 'large' },
  node30: { tileset: 'generic', index: 10, size: 'large' },
  node33: { tileset: 'generic', index: 10, size: 'large' },
  node63: { tileset: 'generic', index: 4, size: 'medium' },
  node64: { tileset: 'generic', index: 4, size: 'medium' },
  node65: { tileset: 'generic', index: 4, size: 'large' },
  node66: { tileset: 'generic', index: 5, size: 'medium' },
  node102: { tileset: 'generic', index: 3, size: 'large' },
  node103: { tileset: 'generic', index: 5, size: 'medium' },
  node106: { tileset: 'generic', index: 5, size: 'medium' },
  node6: { tileset: 'generic', index: 4, size: 'medium' },
  node8: { tileset: 'generic', index: 4, size: 'medium' },
  node99: { tileset: 'generic', index: 4, size: 'medium' },
  node100: { tileset: 'generic', index: 13, size: 'large' },
  node101: { tileset: 'generic', index: 5, size: 'medium' },
  node87: { tileset: 'generic', index: 8, size: 'large' },
  node164: { tileset: 'generic', index: 5, size: 'medium' },
  node91: { tileset: 'generic', index: 5, size: 'medium' },
  node98: { tileset: 'generic', index: 4, size: 'medium' },
  node88: { tileset: 'generic', index: 6, size: 'large' },
  node86: { tileset: 'generic', index: 12, size: 'large' },
  node85: { tileset: 'generic', index: 7, size: 'large' },
  node84: { tileset: 'generic', index: 1, size: 'large' },
  node94: { tileset: 'generic', index: 4, size: 'medium' },
  node95: { tileset: 'generic', index: 4, size: 'medium' },
  node61: { tileset: 'generic', index: 0, size: 'large' },
  node96: { tileset: 'generic', index: 13, size: 'large' },
  node97: { tileset: 'generic', index: 5, size: 'medium' },
  node135: { tileset: 'generic', index: 2, size: 'large' },
  node134: { tileset: 'generic', index: 5, size: 'medium' },
  node136: { tileset: 'generic', index: 5, size: 'medium' },
  node58: { tileset: 'generic', index: 12, size: 'large' },
  node59: { tileset: 'generic', index: 13, size: 'large' },
  node60: { tileset: 'generic', index: 8, size: 'large' },
  node62: { tileset: 'generic', index: 6, size: 'medium' },
  node92: { tileset: 'generic', index: 6, size: 'medium' },
  node93: { tileset: 'generic', index: 6, size: 'medium' },
  node81: { tileset: 'generic', index: 4, size: 'medium' },
  node82: { tileset: 'generic', index: 3, size: 'medium' },
  node83: { tileset: 'generic', index: 3, size: 'medium' },
  node145: { tileset: 'generic', index: 1, size: 'medium' },
  node163: { tileset: 'generic', index: 1, size: 'medium' },
  node161: { tileset: 'generic', index: 1, size: 'medium' },
  node156: { tileset: 'generic', index: 1, size: 'medium' },
  node140: { tileset: 'generic', index: 1, size: 'medium' },
  node143: { tileset: 'generic', index: 1, size: 'medium' },
  node151: { tileset: 'generic', index: 1, size: 'medium' },
  node154: { tileset: 'generic', index: 1, size: 'medium' },
};
