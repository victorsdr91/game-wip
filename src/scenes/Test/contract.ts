import { Vector } from "excalibur";
import { ActorStats } from "../../model/ExtendedActor/contract";
import { EquipmentPropsType, PlayerProgressType } from "../../model/Player/contract";
import { InventoryProps } from "model/Inventory/contract";
import { ItemProps } from "model/Item/types/ItemTypes";
import { EventMap } from "model/EventManager/contract";
import { Skill } from "services/systems/Combat/types/skill.type";
import { NpcType } from "model/Npc/contract";

export interface playerInfoType {
    equipment?: EquipmentPropsType;
    nickname: string;
    position: Vector;
    zIndex: number;
    inventory: InventoryProps;
    progress: PlayerProgressType;
    health: HealthType;
    stats: ActorStats;
    skills: Skill[];
};

export interface HealthType {
    current?: number;
    total: number;
}


export interface NpcInterface {
    name: string;
    type: NpcType;
    pos: {
        x: number,
        y: number,
        z?: number
    };
    health: HealthType;
    sprite: string;
    events?: EventMap;
    spriteSize: {
        width: spriteSize;
        height: spriteSize;
    }
    rewards?: RewardType;
    stats: ActorStats;
    skills: Skill[];
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
    Npcs: Array<NpcInterface>;
}

