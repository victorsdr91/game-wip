import { Item } from "./Item";
import { WereableItem } from "./WereableItem";

export enum ItemType {
    WEREABLE = "wereable",
    USABLE = "usable",
    QUEST = "quest",
    MISC = "misc",
    COIN = "coin",
}

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
    isEquipped?: boolean;
}

export type ItemProps = ItemIface;

export type WereableItemProps = ItemProps & {
    slot: SlotType;
    stats?: ItemStats;
    durability: number; 
    maxDurability: number; 
    isEquipped?: boolean; // Optional property to check if the item is equipped
};

export interface ItemGroupProps {
    item: Item | WereableItem;
    quantity: number;
    stack: number;
}

export enum SlotType {
    HEAD = "head",
    BODY = "body",
    BELT = "belt",
    LEGS = "legs",
    BOOTS = "boots",
    GLOVES = "gloves",
    MAIN_HAND = "main_hand",
    SECOND_HAND = "second_hand",
    NECKLACE = "necklace",
    RING = "ring",
}


export interface ItemStats {
    f_attack?: number;
    f_defense?: number;
    m_attack?: number;
    m_defense?: number;
    speed?: number;
    cSpeed?: number;
    agi?: number;
    con?: number;
}