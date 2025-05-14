import { Vector } from "excalibur";
import { ActorStats } from "../../model/ExtendedActor/contract";

export interface playerInfoType {
    nickname: string;
    position: Vector;
    zIndex: number;
    progress: PlayerProgressType;
    stats: ActorStats;
};

export interface HealthType {
    current: number;
    total: number;
}

export interface PlayerProgressType {
    exp: number,
    expNextLevel: number,
}

export enum NPCTypes {
    PACIFIC = "pacific",
    AGRESSIVE = "agressive"
}

export interface npcType {
    npcName: string;
    type: NPCTypes;
    pos: {
        x: number,
        y: number,
        z?: number
    };
    health: number;
    sprite: string;
    spriteSize: {
        width: spriteSize;
        height: spriteSize;
    }
    dialogue?: Array<String>;
    rewards?: RewardType;
    stats: ActorStats;    
}
  
export enum spriteSize {
    medium = 32,
    small = 16,
    big = 64
}

export interface RewardType {
    exp: number,
    money?: number,
    items?: ItemDrop[],
}

export interface Item {
    id: number,
    name: string,
}

export interface ItemDrop extends Item {
    probability: number;
    quantity: number;
}

export interface worldInfoType {
    playerInfo: playerInfoType;
    npcList: Array<npcType>;
}

