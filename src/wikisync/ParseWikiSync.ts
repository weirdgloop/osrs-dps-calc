import { ImportableData } from '@/types/State';
import { dbrowDefinitions } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';

type League6Payload = {
  mastery0?: number;
  mastery1?: number;
  mastery2?: number;
  mastery3?: number;
  mastery4?: number;
  mastery5?: number;
};

type LoadoutWithLeague6 = ImportableData['loadouts'][number] & {
  league6?: League6Payload;
};

const NODE_NAMES = Object.keys(dbrowDefinitions);

function decodeLeague6SelectedNodeIds(league6?: League6Payload): Set<string> {
  const selected = new Set<string>();

  if (!league6) {
    return selected;
  }

  const values = [
    league6.mastery0 ?? 0,
    league6.mastery1 ?? 0,
    league6.mastery2 ?? 0,
    league6.mastery3 ?? 0,
    league6.mastery4 ?? 0,
    league6.mastery5 ?? 0,
  ];

  values.forEach((value, groupIndex) => {
    for (let bit = 0; bit < 32; bit += 1) {
      if ((value & (1 << bit)) !== 0) {
        const globalIndex = groupIndex * 32 + bit;
        const nodeId = NODE_NAMES[globalIndex];
        if (nodeId) {
          selected.add(nodeId);
        }
      }
    }
  });

  if (NODE_NAMES[0]) {
    selected.add(NODE_NAMES[0]);
  }

  return selected;
}

export default function parseWikiSyncImportableData(data: ImportableData): ImportableData {
  return {
    ...data,
    loadouts: data.loadouts.map((loadout) => {
      const { league6, ...rest } = loadout as LoadoutWithLeague6;

      if (!league6) {
        return loadout;
      }

      return {
        ...rest,
        leagues: {
          ...rest.leagues,
          six: {
            ...rest.leagues?.six,
            selectedNodeIds: decodeLeague6SelectedNodeIds(league6),
          },
        },
      };
    }),
  };
}
