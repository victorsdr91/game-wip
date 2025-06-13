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
}

export interface InventoryItemProps {
    itemGroup: ItemGroup;
    position: { x: number, y: number };
    dimensions: {
        width: number;
        height: number;
        gap: number;
    };
    onDragEnd?: (position: { x: number, y: number }) => void;
}