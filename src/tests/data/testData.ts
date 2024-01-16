import { EquipmentPiece, Player } from '@/types/Player';
import { PartialDeep } from 'type-fest';
import equipment from '../../../cdn/json/equipment.json';

const availableEquipment = equipment.map((v) => v as EquipmentPiece);

const findItemByName = (name: string): EquipmentPiece | undefined => availableEquipment.find((eq) => eq.name === name);

export const createVoidMeleeEquipmentSet = (): PartialDeep<Player> => ({
  equipment: {
    head: findItemByName('Void melee helm'),
    cape: findItemByName('Infernal cape'),
    neck: findItemByName('Amulet of torture'),
    ammo: null,
    weapon: findItemByName('Abyssal tentacle'),
    body: findItemByName('Elite void top'),
    shield: findItemByName('Avernic defender'),
    legs: findItemByName('Elite void robe'),
    hands: findItemByName('Void knight gloves'),
    feet: findItemByName('Primordial boots'),
    ring: findItemByName('Ultor ring'),
  },
});
