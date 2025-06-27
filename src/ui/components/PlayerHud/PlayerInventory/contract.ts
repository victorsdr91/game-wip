import { ItemGroup } from "model/Item/ItemGroup";

export interface InventoryPosition {
    x: number;
    y: number;
}

export interface Inventory {
    items: Map<number, ItemGroup>;
    itemPositions: Map<number, InventoryPosition>;
    slots: number;
    maxWeight: number;
    currentWeight: number;
    dimensions?: {
        columns: number;
        rows: number;
    };
    findFirstEmptySlot: () => number | null;
}

export interface ItemComponentListProps {
    inventory: Inventory;
    onItemRightClick: (itemGroup: ItemGroup) => void;
    onItemDrop: (fromSlot: number) => void;
    isWithinWindow: (position: { x: number, y: number }) => boolean;
}