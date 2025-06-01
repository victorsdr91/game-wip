import { ItemGroupProps } from "model/Item/contract";

export interface InventoryProps {
    slots: number;
    maxWeight: number;
    items?: Map<number, number>;
}