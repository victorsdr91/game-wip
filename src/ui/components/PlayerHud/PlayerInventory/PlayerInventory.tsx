import React, { useRef, useState } from "react";
import { HudPlayerEvents } from "state/helpers/PlayerEvents";
import { ItemGroup } from "model/Item/ItemGroup";
import GameWindow from "../../Common/GameWindow";
import InventoryGrid from "./InventoryGrid";
import InventoryFooter from "./InventoryFooter";
import { WereableItem } from "model/Item/WereableItem";
import { Game } from "services/Game";
import { useInventory } from "ui/clientState/providers/PlayerItemHandler/InventoryProvider";
import ItemComponentList from "./ItemComponentList";

const PlayerInventory = () => {
    const invRef = useRef<HTMLDivElement>(null);
    const { inventory } = useInventory();
    const [showDropPopup, setShowDropPopup] = useState<boolean>(false);

    const calculateInventoryDimensions = () => {
        const positions = Array.from(inventory.itemPositions.values());
        if (positions.length === 0) return { width: 0, height: 0 };

        const maxX = Math.max(...positions.map(p => p.x));
        const maxY = Math.max(...positions.map(p => p.y));

        // Añadir el tamaño del último slot
        return {
            width: maxX + 32,  // 32 = tamaño del slot
            height: maxY + 32
        };
    };

    const handleItemEquip = (itemGroup: ItemGroup) => {
        if (!(itemGroup.getItem() instanceof WereableItem)) return;
        
        const item = itemGroup.getItem() as WereableItem;
        const slot = item.getSlot();
        const fromSlot = findItemSlot(itemGroup);

        if (fromSlot !== null) {
            Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_EQUIP_ITEM, {
                fromSlot,
                toSlot: slot,
                itemGroup
            });
        }
    };

    const handleItemDrop = (fromSlot: number) => {
        const shouldDrop = window.confirm('¿Deseas eliminar este objeto?');
        if (shouldDrop) {
            Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_INVENTORY_ITEM_DROPPED, {
                fromSlot
            });
        }
        return;

    };

    const findItemSlot = (itemGroup: ItemGroup): number | null => {
        for (const [slotId, group] of inventory.items.entries()) {
            if (group === itemGroup) {
                return slotId;
            }
        }
        return null;
    };

    const isWithinWindow = (position: { x: number, y: number }): boolean => {
        if (!invRef.current) return false;
        const rect = invRef.current.getBoundingClientRect();
        return position.x >= 0 && position.x <= rect.width &&
            position.y >= -50 && position.y <= rect.height+50;
    };

    const dimensions = calculateInventoryDimensions();

    return (
            <GameWindow
                windowHeader={"Bag"}
                playerEvent={HudPlayerEvents.HUD_PLAYER_TOGGLE_INVENTORY}
                initialPosition={{
                    x: 750,
                    y: 150,
                }}
            >   <div ref={invRef}>
                    <div className="relative my-2" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
                        <InventoryGrid inventory={inventory} />
                        <ItemComponentList 
                            inventory={inventory}
                            onItemRightClick={handleItemEquip}
                            onItemDrop={handleItemDrop}
                            isWithinWindow={isWithinWindow}
                        />
                    </div>
                    <InventoryFooter inventory={inventory} />
                </div>
            </GameWindow>
    );
};


export default PlayerInventory;