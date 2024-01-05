import React from "react";
import head from "@/public/img/slots/head.png";
import cape from "@/public/img/slots/cape.png";
import neck from "@/public/img/slots/neck.png";
import ammo from "@/public/img/slots/ammo.png";
import weapon from "@/public/img/slots/weapon.png";
import body from "@/public/img/slots/body.png";
import shield from "@/public/img/slots/shield.png";
import legs from "@/public/img/slots/legs.png";
import hands from "@/public/img/slots/hands.png";
import feet from "@/public/img/slots/feet.png";
import ring from "@/public/img/slots/ring.png";
import EquipmentGridSlot from "@/app/components/player/equipment/EquipmentGridSlot";

const EquipmentGrid: React.FC = () => {
  return (
    <>
      <div className={'flex justify-center'}>
        <EquipmentGridSlot slot={'head'} placeholder={head.src}/>
      </div>
      <div className={'mt-1 flex justify-center gap-2'}>
        <EquipmentGridSlot slot={'cape'} placeholder={cape.src}/>
        <EquipmentGridSlot slot={'neck'} placeholder={neck.src}/>
        <EquipmentGridSlot slot={'ammo'} placeholder={ammo.src}/>
      </div>
      <div className={'mt-1 flex justify-center gap-6'}>
        <EquipmentGridSlot slot={'weapon'} placeholder={weapon.src}/>
        <EquipmentGridSlot slot={'body'} placeholder={body.src}/>
        <EquipmentGridSlot slot={'shield'} placeholder={shield.src}/>
      </div>
      <div className={'mt-1 flex justify-center'}>
        <EquipmentGridSlot slot={'legs'} placeholder={legs.src}/>
      </div>
      <div className={'mt-1 flex justify-center gap-6'}>
        <EquipmentGridSlot slot={'hands'} placeholder={hands.src}/>
        <EquipmentGridSlot slot={'feet'} placeholder={feet.src}/>
        <EquipmentGridSlot slot={'ring'} placeholder={ring.src}/>
      </div>
    </>
  )
}

export default EquipmentGrid;
