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
}