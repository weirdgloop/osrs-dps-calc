export enum MonsterAttribute {
  DEMON = 'demon',
  DRAGON = 'dragon',
  FIERY = 'fiery',
  GOLEM = 'golem',
  KALPHITE = 'kalphite',
  LEAFY = 'leafy',
  PENANCE = 'penance',
  SHADE = 'shade',
  SPECTRAL = 'spectral',
  UNDEAD = 'undead',
  VAMPYRE_1 = 'vampyre1',
  VAMPYRE_2 = 'vampyre2',
  VAMPYRE_3 = 'vampyre3',
  XERICIAN = 'xerician',
}

export const isVampyre = (attr: string | string[]): boolean => {
  if (Array.isArray(attr)) {
    return attr.some(a => isVampyre(a));
  }
  return ['vampyre1', 'vampyre2', 'vampyre3'].includes(attr);
}
