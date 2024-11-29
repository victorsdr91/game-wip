import { Vector } from "excalibur";
import { configType } from "../../contract";
import { ActorStats } from "../../model/ExtendedActor/contract";

export interface playerInfoType {
    nickname: string;
    position: Vector;
    zIndex: number;
    stats: ActorStats;
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
    spriteSize: spriteSize;
    dialogue?: Array<String>;
    stats: ActorStats;    
}
  
export enum spriteSize {
    medium = 32,
    small = 16,
    big = 64
}

export interface worldInfoType {
    playerInfo: playerInfoType;
    npcList: Array<npcType>;
}

