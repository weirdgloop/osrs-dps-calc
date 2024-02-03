import { Monster } from '@/types/Monster';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import monsters from '../../cdn/json/monsters.json';

function getMonsters(): Omit<Monster, 'inputs'>[] {
  return monsters.map((m) => {
    const maxHit = parseInt(m.max_hit.toString());
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      image: m.image,
      size: m.size,
      speed: m.speed,
      style: m.style ? m.style.join(',').toLowerCase() : null,
      maxHit: Number.isNaN(maxHit) ? 0 : maxHit,
      skills: {
        atk: m.skills[0],
        def: m.skills[1],
        hp: m.skills[2],
        magic: m.skills[3],
        ranged: m.skills[4],
        str: m.skills[5],
      },
      offensive: {
        atk: m.offensive[0],
        magic: m.offensive[2],
        magic_str: m.offensive[1],
        ranged: m.offensive[3],
        ranged_str: m.offensive[4],
        str: m.offensive[5],
      },
      defensive: {
        crush: m.defensive[0],
        magic: m.defensive[1],
        ranged: m.defensive[2],
        slash: m.defensive[3],
        stab: m.defensive[4],
      },
      attributes: m.attributes as MonsterAttribute[],
    } as Omit<Monster, 'inputs'>;
  });
}

export default getMonsters;
