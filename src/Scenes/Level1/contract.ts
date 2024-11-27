import { Vector } from "excalibur";
import { configType } from "../../contract";

export interface playerInfoType {
    nickname: string;
    position: Vector;
    zIndex: number;
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
    dialogue?: Array<String>;    
}
  
export interface worldInfoType {
    config: configType;
    playerInfo: playerInfoType;
    npcList: Array<npcType>;
}

