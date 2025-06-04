import { SlotType } from "model/Player/types/SlotType.enum";
import { ItemIface, ItemStats } from "../contract";
import { Item } from "../Item";
import { WereableItem } from "../WereableItem";

export type ItemProps = ItemIface;
export type ItemClass = Item | WereableItem;
export type WereableItemProps = ItemProps & {
    slot: SlotType;
    stats?: ItemStats;
    durability: number; 
    maxDurability: number;
};