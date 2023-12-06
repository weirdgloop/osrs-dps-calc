import {StaticImageData} from "next/image";
import ArchersEmbrace from "@/public/img/league/Archer's_Embrace.webp";
import BrawlersResolve from "@/public/img/league/Brawler's_Resolve.webp";
import SuperiorSorcerer from "@/public/img/league/Superior_Sorcerer.webp";
import SoulStealer from "@/public/img/league/Soul_Stealer.webp";

export enum TrailblazerRelic {
    ARCHERS_EMBRACE,
    BRAWLERS_RESOLVE,
    SUPERIOR_SORCERER,
    SOUL_STEALER,
    // WEAPON_MASTER, // todo only matters if we implement special attacks
    // BERSERKER,
}

export interface TrailblazerRelicData {
    name: string,
    image: StaticImageData,
}

export const TrailblazerRelicMap: {[k in TrailblazerRelic]: TrailblazerRelicData} = {
    [TrailblazerRelic.ARCHERS_EMBRACE]: {
        name: "Archer's Embrace",
        image: ArchersEmbrace,
    },
    [TrailblazerRelic.BRAWLERS_RESOLVE]: {
        name: "Brawler's Resolve",
        image: BrawlersResolve,
    },
    [TrailblazerRelic.SUPERIOR_SORCERER]: {
        name: "Superior Sorcerer",
        image: SuperiorSorcerer,
    },
    [TrailblazerRelic.SOUL_STEALER]: {
        name: "Soul Stealer",
        image: SoulStealer,
    },
}
