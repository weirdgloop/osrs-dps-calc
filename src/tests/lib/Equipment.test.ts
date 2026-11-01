import { findEquipment, getTestMonster, getTestPlayer } from '@/tests/utils/TestUtils';
import { describe, expect, test } from '@jest/globals';
import {
  AmmoApplicability,
  ammoApplicability,
  availableEquipment,
  calculateEquipmentBonusesFromGear,
} from '@/lib/Equipment';
import { EquipmentPiece } from '@/types/Player';

const chargedQuivers = () => [
  findEquipment("Dizana's quiver", 'Charged'),
  findEquipment("Blessed Dizana's quiver", 'Normal'),
  findEquipment("Dizana's max cape", 'Normal'),
];

// every ammo the weapon can fire, so newly added javelins, darts, tars, etc. are covered automatically
const ammoUsedBy = (weapon: EquipmentPiece) => availableEquipment.filter(
  (e) => e.slot === 'ammo' && ammoApplicability(weapon.id, e.id) === AmmoApplicability.INCLUDED,
);

// the bonus the cape gives on top of its own stats
const getQuiverBonus = (weapon: EquipmentPiece, ammo: EquipmentPiece, cape: EquipmentPiece) => {
  const monster = getTestMonster('Abyssal demon', 'Standard');
  const withoutCape = calculateEquipmentBonusesFromGear(getTestPlayer(monster, { equipment: { weapon, ammo } }), monster);
  const withCape = calculateEquipmentBonusesFromGear(getTestPlayer(monster, { equipment: { weapon, ammo, cape } }), monster);

  return {
    ammo: ammo.name,
    cape: cape.name,
    ranged: withCape.offensive.ranged - withoutCape.offensive.ranged - cape.offensive.ranged,
    rangedStr: withCape.bonuses.ranged_str - withoutCape.bonuses.ranged_str - cape.bonuses.ranged_str,
  };
};

describe('calculateEquipmentBonusesFromGear', () => {
  describe("with Dizana's quiver", () => {
    describe('with weapon using ammo slot', () => {
      test('applies bonus when charged', () => {
        const monster = getTestMonster('Abyssal demon', 'Standard');
        const playerWithChargedQuiver = getTestPlayer(monster, {
          equipment: {
            cape: findEquipment("Dizana's quiver", 'Charged'),
            weapon: findEquipment('Twisted bow'),
            ammo: findEquipment('Dragon arrow', 'Unpoisoned'),
          },
        });

        const bonuses = calculateEquipmentBonusesFromGear(playerWithChargedQuiver, monster);
        expect(bonuses.offensive.ranged).toStrictEqual(98);
        expect(bonuses.bonuses.ranged_str).toStrictEqual(84);
      });

      test('applies bonus when blessed', () => {
        const monster = getTestMonster('Abyssal demon', 'Standard');
        const playerWithChargedQuiver = getTestPlayer(monster, {
          equipment: {
            cape: findEquipment("Blessed Dizana's quiver", 'Normal'),
            weapon: findEquipment('Twisted bow'),
            ammo: findEquipment('Dragon arrow', 'Unpoisoned'),
          },
          offensive: {
            ranged: 0,
          },
          bonuses: {
            ranged_str: 0,
          },
        });

        const bonuses = calculateEquipmentBonusesFromGear(playerWithChargedQuiver, monster);
        expect(bonuses.offensive.ranged).toStrictEqual(98);
        expect(bonuses.bonuses.ranged_str).toStrictEqual(84);
      });

      test('does not apply bonus when uncharged', () => {
        const monster = getTestMonster('Abyssal demon', 'Standard');
        const playerWithChargedQuiver = getTestPlayer(monster, {
          equipment: {
            cape: findEquipment("Dizana's quiver", 'Uncharged'),
            weapon: findEquipment('Twisted bow'),
            ammo: findEquipment('Dragon arrow', 'Unpoisoned'),
          },
          offensive: {
            ranged: 0,
          },
          bonuses: {
            ranged_str: 0,
          },
        });

        const bonuses = calculateEquipmentBonusesFromGear(playerWithChargedQuiver, monster);
        expect(bonuses.offensive.ranged).toStrictEqual(88);
        expect(bonuses.bonuses.ranged_str).toStrictEqual(83);
      });
    });
    describe('with weapon not using ammo slot', () => {
      test('does not apply bonus when charged', () => {
        const monster = getTestMonster('Abyssal demon', 'Standard');
        const playerWithChargedQuiver = getTestPlayer(monster, {
          equipment: {
            cape: findEquipment("Dizana's quiver", 'Charged'),
            weapon: findEquipment('Dragon dart'),
          },
        });

        const bonuses = calculateEquipmentBonusesFromGear(playerWithChargedQuiver, monster);
        expect(bonuses.offensive.ranged).toStrictEqual(18);
        expect(bonuses.bonuses.ranged_str).toStrictEqual(38);
      });

      test('does not apply bonus when blessed', () => {
        const monster = getTestMonster('Abyssal demon', 'Standard');
        const playerWithChargedQuiver = getTestPlayer(monster, {
          equipment: {
            cape: findEquipment("Blessed Dizana's quiver", 'Normal'),
            weapon: findEquipment('Dragon dart'),
          },
          offensive: {
            ranged: 0,
          },
          bonuses: {
            ranged_str: 0,
          },
        });

        const bonuses = calculateEquipmentBonusesFromGear(playerWithChargedQuiver, monster);
        expect(bonuses.offensive.ranged).toStrictEqual(18);
        expect(bonuses.bonuses.ranged_str).toStrictEqual(38);
      });

      test('does not apply bonus when uncharged', () => {
        const monster = getTestMonster('Abyssal demon', 'Standard');
        const playerWithChargedQuiver = getTestPlayer(monster, {
          equipment: {
            cape: findEquipment("Dizana's quiver", 'Uncharged'),
            weapon: findEquipment('Dragon dart'),
          },
          offensive: {
            ranged: 0,
          },
          bonuses: {
            ranged_str: 0,
          },
        });

        const bonuses = calculateEquipmentBonusesFromGear(playerWithChargedQuiver, monster);
        expect(bonuses.offensive.ranged).toStrictEqual(18);
        expect(bonuses.bonuses.ranged_str).toStrictEqual(38);
      });
    });
    describe('with weapon firing arrows or bolts', () => {
      test.each([
        'Twisted bow',
        'Comp ogre bow',
        'Rune crossbow',
        'Zaryte crossbow',
      ])('applies bonus to %s with any of its ammo', (weaponName) => {
        const weapon = findEquipment(weaponName);
        const ammos = ammoUsedBy(weapon);
        expect(ammos.length).toBeGreaterThan(0);

        for (const ammo of ammos) {
          for (const cape of chargedQuivers()) {
            expect(getQuiverBonus(weapon, ammo, cape)).toStrictEqual({
              ammo: ammo.name, cape: cape.name, ranged: 10, rangedStr: 1,
            });
          }
        }
      });
    });
    describe('with weapon firing ammo that cannot be stored in the quiver', () => {
      test.each([
        'Heavy ballista',
        'Light ballista',
        'Eclipse atlatl',
        'Swamp lizard',
        'Orange salamander',
        'Red salamander',
        'Black salamander',
        'Tecu salamander',
      ])('does not apply bonus to %s with any of its ammo', (weaponName) => {
        const weapon = findEquipment(weaponName);
        const ammos = ammoUsedBy(weapon);
        expect(ammos.length).toBeGreaterThan(0);

        for (const ammo of ammos) {
          for (const cape of chargedQuivers()) {
            expect(getQuiverBonus(weapon, ammo, cape)).toStrictEqual({
              ammo: ammo.name, cape: cape.name, ranged: 0, rangedStr: 0,
            });
          }
        }
      });
    });
  });
});
