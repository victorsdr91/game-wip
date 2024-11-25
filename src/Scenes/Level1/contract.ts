import { Vector } from "excalibur";

export interface playerInfoType {
    nickname: string;
    position: Vector;
    zIndex: number;
}

export interface npcType {
    position: Vector;
    name: string;
    type: string;
}
  
export interface worldInfoType {
    playerInfo: playerInfoType,
    npc?: [npcType],
}
