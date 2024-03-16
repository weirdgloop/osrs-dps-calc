import { Monster } from '@/types/Monster';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { isCombatStyleType } from '@/types/PlayerCombatStyle';
import monsters from '../../cdn/json/monsters.json';

function getMonsters(): Omit<Monster, 'inputs'>[] {
  return monsters.map((m): Omit<Monster, 'inputs'> => {
    const maxHit = parseInt(m.max_hit.toString());
    const styleStr = m.style?.join(',').toLowerCase() || null;
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      image: m.image,
      size: m.size,
      speed: m.speed,
      style: isCombatStyleType(styleStr) ? styleStr : null,
      maxHit: Number.isNaN(maxHit) ? 0 : maxHit,
      skills: m.skills,
      offensive: m.offensive,
      defensive: m.defensive,
      attributes: m.attributes as MonsterAttribute[],
      weakness: m.weakness as Monster['weakness'],
    };
  });
}

export default getMonsters;
