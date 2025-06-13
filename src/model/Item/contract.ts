import { SlotType } from "model/Player/types/SlotType.enum";
import { ItemType } from "./types/ItemTypes.enum";
import { ItemClass } from "./types/ItemTypes";

export interface ItemIface {
    readonly id: number;
    name: string;
    description: string;
    cooldown: number;
    type: ItemType;
    agruppable?: boolean;
    weight: number;
    effect?: any; // Placeholder for future effects
    slot?: SlotType; // Optional property for wearable items;
    stats?: ItemStats;
    durability?: number;
    maxDurability?: number;
    stackSize?: number; // Optional property for stackable items
    icon?: string;
    sprite?: string; // Optional property for items with a sprite representation
}

export interface ItemGroupProps {
    item: ItemClass;
    quantity: number;
};

export interface ItemStats {
    f_attack?: number;
    f_defense?: number;
    m_attack?: number;
    m_defense?: number;
    speed?: number;
    cSpeed?: number;
    agi?: number;
    con?: number;
    f_damage?: number;
    m_damage?: number;
    critical_rate?: number;
}