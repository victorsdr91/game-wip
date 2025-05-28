import { ItemGroupProps, ItemProps } from "model/Item/contract";
import { ItemGroup } from "model/Item/ItemGroup";

export interface InventoryProps {
    items?: ItemGroupProps[];
    slots: number;
    maxWeight: number;
    currentWeight: number;
}