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
{ tileset: string; index: number }
> = {
  // Ranged
  node2: { tileset: 'ranged', index: 9 },
  node3: { tileset: 'ranged', index: 3 },
  node4: { tileset: 'ranged', index: 7 },
  node5: { tileset: 'ranged', index: 13 },
  node14: { tileset: 'ranged', index: 14 },
  node16: { tileset: 'ranged', index: 15 },
  node18: { tileset: 'ranged', index: 8 },
  node20: { tileset: 'ranged', index: 2 },
  node21: { tileset: 'ranged', index: 6 },
  node22: { tileset: 'ranged', index: 12 },
  node38: { tileset: 'ranged', index: 9 },
  node39: { tileset: 'ranged', index: 9 },
  node26: { tileset: 'ranged', index: 0 },
  node28: { tileset: 'ranged', index: 1 },
  node29: { tileset: 'ranged', index: 4 },
  node31: { tileset: 'ranged', index: 5 },
  node32: { tileset: 'ranged', index: 11 },
  node34: { tileset: 'ranged', index: 10 },

  // Magic
  node44: { tileset: 'magic', index: 8 },
  node45: { tileset: 'magic', index: 3 },
  node46: { tileset: 'magic', index: 7 },
  node47: { tileset: 'magic', index: 17 },
  node48: { tileset: 'magic', index: 13 },
  node166: { tileset: 'magic', index: 21 },
  node53: { tileset: 'magic', index: 22 },
  node54: { tileset: 'magic', index: 24 },
  node167: { tileset: 'magic', index: 23 },
  node133: { tileset: 'magic', index: 20 },
  node122: { tileset: 'magic', index: 9 },
  node123: { tileset: 'magic', index: 5 },
  node124: { tileset: 'magic', index: 15 },
  node107: { tileset: 'magic', index: 2 },
  node131: { tileset: 'magic', index: 11 },
  node127: { tileset: 'magic', index: 12 },
  node112: { tileset: 'magic', index: 6 },
  node117: { tileset: 'magic', index: 16 },
  node109: { tileset: 'magic', index: 0 },
  node114: { tileset: 'magic', index: 4 },
  node119: { tileset: 'magic', index: 14 },
  node129: { tileset: 'magic', index: 10 },
  node111: { tileset: 'magic', index: 1 },

  // Melee
  node74: { tileset: 'melee', index: 16 },
  node71: { tileset: 'melee', index: 2 },
  node72: { tileset: 'melee', index: 12 },
  node73: { tileset: 'melee', index: 6 },
  node43: { tileset: 'melee', index: 8 },
  node146: { tileset: 'melee', index: 17 },
  node79: { tileset: 'melee', index: 13 },
  node162: { tileset: 'melee', index: 9 },
  node165: { tileset: 'melee', index: 3 },
  node157: { tileset: 'melee', index: 7 },
  node80: { tileset: 'melee', index: 17 },
  node139: { tileset: 'melee', index: 1 },
  node142: { tileset: 'melee', index: 11 },
  node150: { tileset: 'melee', index: 5 },
  node153: { tileset: 'melee', index: 15 },
  node141: { tileset: 'melee', index: 0 },
  node144: { tileset: 'melee', index: 10 },
  node152: { tileset: 'melee', index: 4 },
  node155: { tileset: 'melee', index: 14 },

  // Generic
  node9: { tileset: 'generic', index: 12 },
  node10: { tileset: 'generic', index: 8 },
  node11: { tileset: 'generic', index: 12 },
  node12: { tileset: 'generic', index: 5 },
  node27: { tileset: 'generic', index: 10 },
  node30: { tileset: 'generic', index: 10 },
  node33: { tileset: 'generic', index: 10 },
  node63: { tileset: 'generic', index: 0 },
  node64: { tileset: 'generic', index: 0 },
  node65: { tileset: 'generic', index: 4 },
  node66: { tileset: 'generic', index: 3 },
  node102: { tileset: 'generic', index: 3 },
  node103: { tileset: 'generic', index: 3 },
  node106: { tileset: 'generic', index: 3 },
  node6: { tileset: 'generic', index: 0 },
  node8: { tileset: 'generic', index: 0 },
  node99: { tileset: 'generic', index: 0 },
  node100: { tileset: 'generic', index: 13 },
  node101: { tileset: 'generic', index: 3 },
  node87: { tileset: 'generic', index: 8 },
  node164: { tileset: 'generic', index: 3 },
  node91: { tileset: 'generic', index: 3 },
  node98: { tileset: 'generic', index: 0 },
  node88: { tileset: 'generic', index: 6 },
  node86: { tileset: 'generic', index: 12 },
  node85: { tileset: 'generic', index: 7 },
  node84: { tileset: 'generic', index: 1 },
  node94: { tileset: 'generic', index: 0 },
  node95: { tileset: 'generic', index: 0 },
  node61: { tileset: 'generic', index: 0 },
  node96: { tileset: 'generic', index: 13 },
  node97: { tileset: 'generic', index: 3 },
  node135: { tileset: 'generic', index: 2 },
  node134: { tileset: 'generic', index: 3 },
  node136: { tileset: 'generic', index: 3 },
  node58: { tileset: 'generic', index: 12 },
  node59: { tileset: 'generic', index: 13 },
  node60: { tileset: 'generic', index: 8 },
};
