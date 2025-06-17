import { ItemGroup } from "model/Item/ItemGroup";

export interface ItemComponentProps {
    itemGroup: ItemGroup;
    position: { x: number, y: number };
    dimensions: {
        width: number;
        height: number;
        gap: number;
    };
    onDragEnd?: (position: { x: number, y: number }) => void;
    onRightClick?: (itemGroup: ItemGroup) => void;
}