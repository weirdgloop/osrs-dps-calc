import { ManualModeDerivedOverrides, Player, PlayerBase } from '@/types/Player';
import { Monster } from '@/types/Monster';
import axios from 'axios';

export const SHORTLINK_API = 'https://tools.runescape.wiki/osrs-dps/shortlink';

/**
 * The exported data version, which can be used to perform lazy migrations on load,
 * if the application changes since the data was written to storage.
 * This value should be incremented every time {@link ImportableData},
 * or any of its subproperties, are updated in a non-backwards-compatible manner,
 * or also in any manner that could affect the migrations required on load.
 */
export const IMPORT_VERSION = 11 as const;

export interface ImportableDataV1 {
  serializationVersion: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  selectedLoadout: number;
  loadouts: Player[];
}

/**
 * This is the state that can be exported and imported (through shortlinks).
 * If you change the schema here without taking precautions, you **will** break existing shortlinks.
 */
export interface ImportableDataV2<Manual extends boolean> {
  // can be any number <= IMPORT_VERSION
  serializationVersion: Omit<number, ImportableDataV1['serializationVersion']>;
  manualMode: Manual;
  selectedLoadout: number;

  loadouts: Array<{
    base: PlayerBase,
    manualOverrides: Manual extends true ? ManualModeDerivedOverrides : never,
  }>;

  monster: Monster;
}

type ImportableData = ImportableDataV1 | ImportableDataV2<true> | ImportableDataV2<false>;

export const JSON_REPLACER = (k: string, v: Map<unknown, unknown> | Set<unknown> | never) => {
  if (v instanceof Map) {
    return {
      _dataType: 'Map',
      m: Array.from(v),
    };
  }
  if (v instanceof Set) {
    return {
      _dataType: 'Set',
      s: Array.from(v),
    };
  }
  return v;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const JSON_REVIVER = (k: string, v: any) => {
  if (typeof v === 'object' && v?._dataType === 'Map') {
    return new Map(v.m);
  }
  if (typeof v === 'object' && v?._dataType === 'Set') {
    return new Set(v.s);
  }
  return v;
};

export const fetchShortlinkData = async (linkId: string): Promise<ImportableData> => {
  const res = await axios.get<ImportableData>(`${SHORTLINK_API}?id=${linkId}`, {
    parseReviver: JSON_REVIVER,
  });
  return res.data;
};

interface ShortLinkResponse {
  data: string;
}
export const generateShortlink = async (data: ImportableData): Promise<string> => {
  const res = await axios.post<ShortLinkResponse>(SHORTLINK_API, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: (v) => JSON.stringify(v, JSON_REPLACER),
  });
  return res.data.data;
};
