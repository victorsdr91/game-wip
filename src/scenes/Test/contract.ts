import { Vector } from "excalibur";
import { ActorStats } from "../../model/ExtendedActor/contract";
import { EquipmentPropsType, PlayerProgressType } from "../../model/Player/contract";
import { InventoryProps } from "model/Inventory/contract";
import { ItemProps } from "model/Item/types/ItemTypes";
import { EventMap } from "model/EventManager/contract";

export interface playerInfoType {
    equipment?: EquipmentPropsType;
    nickname: string;
    position: Vector;
    zIndex: number;
    inventory: InventoryProps;
    progress: PlayerProgressType;
    currentHealth: number,
    maxHealth: number,
    stats: ActorStats;
};

export interface agressiveNpcType {
    name: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    sprite: string;
    spriteSize: {
        width: number;
        height: number;
    };
    stats: ActorStats;
    currentHealth?: number;
    maxHealth: number;
    rewards: RewardType;
    events?: EventMap;
}

export interface HealthType {
    current: number;
    total: number;
}

export enum NPCTypes {
    PACIFIC = "pacific",
    AGRESSIVE = "agressive"
}

export interface NPC {
    npcName: string;
    type: NPCTypes;
    pos: {
        x: number,
        y: number,
        z?: number
    };
    currentHealth?: number;
    maxHealth: number;
    sprite: string;
    events?: EventMap;
    spriteSize: {
        width: spriteSize;
        height: spriteSize;
    }
    rewards?: RewardType;
    stats: ActorStats;    
}

export interface PacificNpcType {
    name: string;
    pos: {
        x: number,
        y: number,
        z?: number
    };
    currentHealth?: number;
    maxHealth: number;
    sprite: string;
    events?: EventMap;
    spriteSize: {
        width: spriteSize;
        height: spriteSize;
    }
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
    items?: ItemDrop[],
}

export interface ItemDrop {
    item: ItemProps;
    probability: number;
    quantity: number;
}

export interface worldInfoType {
    playerInfo: playerInfoType;
    pacificNPCs: Array<PacificNpcType>;
    agressiveNPCs: Array<agressiveNpcType>;
}

