import React, { FC, useState } from "react";
import { ItemComponentListProps } from "./contract";
import { Game } from "services/Game";
import { HudPlayerEvents } from "state/helpers/PlayerEvents";
import ItemComponent from "../Item/ItemComponent";
import DropItemPopup from "./DropItemPopUp";


const ItemComponentList: FC<ItemComponentListProps> = ({ inventory, onItemDrop, onItemRightClick, isWithinWindow }) => {

    const findNearestSlot = (mousePos: { x: number, y: number }): {index: number, position: { x: number; y:number}} | null => {
        let nearest: {index: number, position: { x: number; y:number}} | null = null;
        let minDistance = Infinity;

        Array.from(inventory.itemPositions.entries()).forEach(([slotId, slotPos]) => {
            const dx = mousePos.x - slotPos.x;
            const dy = mousePos.y - slotPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearest = { index: slotId, position: slotPos };
            }
        });

        return nearest;
    };

     const handleItemDragEnd = (fromSlot: number, position: { x: number, y: number }) => {
        // Si el drag termina fuera del inventario
        if (!isWithinWindow(position)) {
            onItemDrop(fromSlot);
            return;
        }

        // Si el drag termina dentro del inventario
        const toSlot = findNearestSlot(position);
        if (!toSlot) return;

        Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_INVENTORY_ITEM_MOVED, {
            fromSlot,
            toSlot: toSlot.index
        });
    };

    return (
        <div className="absolute inset-0">
            {Array.from(inventory.items.entries()).map(([slotId, itemGroup]) => {
                const position = inventory.itemPositions.get(slotId);
                if (!position) return null;

                return (
                    <ItemComponent 
                        key={`item-${slotId}`}
                        itemGroup={itemGroup}
                        position={position}
                        dimensions={{
                            width: 32,
                            height: 32,
                            gap: 8
                        }}
                        onDragEnd={(pos) => handleItemDragEnd(slotId, pos)}
                        onRightClick={onItemRightClick}
                    />
                );
            })}
        </div>
    )
};

export default ItemComponentList;