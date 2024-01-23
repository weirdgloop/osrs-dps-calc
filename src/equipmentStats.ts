import { keys } from '@/utils';
import { TOMBS_OF_AMASCUT_MONSTER_IDS } from '@/constants';
import { sum } from 'd3-array';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { isValidAmmoForRangedWeapon } from '@/lib/Equipment';

export type EquipmentBonuses = Pick<Player, 'bonuses' | 'offensive' | 'defensive'>;

export const calculateEquipmentBonusesFromGear = (player: Player, monster: Monster): EquipmentBonuses => {
  const totals: EquipmentBonuses = {
    bonuses: {
      str: 0,
      magic_str: 0,
      ranged_str: 0,
      prayer: 0,
    },
    offensive: {
      slash: 0,
      stab: 0,
      crush: 0,
      ranged: 0,
      magic: 0,
    },
    defensive: {
      slash: 0,
      stab: 0,
      crush: 0,
      ranged: 0,
      magic: 0,
    },
  };

  keys(player.equipment).forEach((slot) => {
    const piece = player.equipment[slot];
    if (!piece) {
      return;
    }

    // If this is the ammo slot, determine whether the ammo is compatible with the current weapon.
    if (piece.slot === 'ammo' && !isValidAmmoForRangedWeapon(player.equipment.weapon?.id, piece.id)) {
      // If it is not valid ammo, then don't include this in the bonuses.
      return;
    }

    keys(piece.bonuses).forEach((stat) => {
      totals.bonuses[stat] += piece.bonuses[stat] || 0;
    });
    keys(piece.offensive).forEach((stat) => {
      totals.offensive[stat] += piece.offensive[stat] || 0;
    });
    keys(piece.defensive).forEach((stat) => {
      totals.defensive[stat] += piece.defensive[stat] || 0;
    });
  });

  if (player.equipment.weapon?.name === "Tumeken's shadow") {
    const factor = TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id) ? 4 : 3;
    totals.bonuses.magic_str *= factor;
    totals.offensive.magic *= factor;
  }

  if (player.equipment.weapon?.name === "Dinh's bulwark" || player.equipment.weapon?.name === "Dinh's blazing bulwark") {
    const defensives = totals.defensive;
    const defenceSum = defensives.stab + defensives.slash + defensives.crush + defensives.ranged;
    totals.bonuses.str += Math.max(0, Math.trunc((defenceSum - 800) / 12) - 38);
  }

  if (player.spell?.spellbook === 'ancient') {
    const virtusPieces = sum([player.equipment.head?.name, player.equipment.body?.name, player.equipment.legs?.name], (i) => (i?.includes('Virtus') ? 1 : 0));
    totals.bonuses.magic_str += 3 * virtusPieces;
  }

  return totals;
};
