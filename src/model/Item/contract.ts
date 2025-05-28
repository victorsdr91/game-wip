import { Item } from "./Item";

export enum ItemType {
    WEREABLE = "wereable",
    USABLE = "usable",
    QUEST = "quest",
    MISC = "misc",
    COIN = "coin",
}

export interface ItemProps {
    id: number;
    name: string;
    description: string;
    cooldown: number;
    type: ItemType;
    agruppable?: boolean;
    weight: number;
}

export interface ItemGroupProps {
    item: Item;
    quantity: number;
    stack: number;
}