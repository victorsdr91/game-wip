import React, { useState } from "react";
import { HudPlayerEvents } from "state/helpers/PlayerEvents";
import { ItemGroup } from "model/Item/ItemGroup";
import { Inventory } from "./contract";
import { useGameEvent } from "app/clientState/hooks/useGameEvent/useGameEvent";
import InventoryItemList from "./InventoryItemList";
import Draggable from "../Common/Draggable";

const PlayerInventory = () => {
    const [showIventory, setShowInventory] = useState<boolean>(false);

    const [inventoryPosition, setInventoryPosition] = useState({
        x: 750,
        y: 150,
    });

    const handleInventoryDragEnd = (newPosition: { x: number; y: number }) => {
        setInventoryPosition(newPosition);
    };
    
    const [inventory, setInventory] = useState<Inventory>({ 
        items: new Map<number, ItemGroup>(), 
        itemPositions: new Map<number, { x: number, y: number }>(),
        slots: 32, 
        maxWeight: 0, 
        currentWeight: 0
    });

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

    useGameEvent({
        event: HudPlayerEvents.HUD_PLAYER_INVENTORY_UPDATE,
        callback: (newInventory) => {
            setInventory(newInventory);
        }
    });

    useGameEvent({
        event: HudPlayerEvents.HUD_PLAYER_TOGGLE_INVENTORY,
        callback: ({ isPressed }) => {
            isPressed = true;
            setShowInventory(!showIventory);
        }
    });

    const closeInventory = (e) => {
        setShowInventory(false);
        e.stopPropagation();
    }

    const dimensions = calculateInventoryDimensions();

    return (
        <Draggable
            initialPos={inventoryPosition}
            onDragEnd={handleInventoryDragEnd}
            className="absolute"
            style={{
                left: `${inventoryPosition.x}px`,
                top: `${inventoryPosition.y}px`,
            }}
            >
                <div 
                    className={`${showIventory ? "block" : "hidden"} p-3 bg-amber-900 text-amber-200 text-[8px] border-amber-950 border-3 rounded-md cursor-default`}
                    onMouseDown={(e) => {
                        // Detener la propagación si el clic no es en la cabecera
                        const target = e.target as HTMLElement;
                        if (!target.closest('.inventory-header') || target.closest('.close-inventory')) {
                            e.stopPropagation();
                        }
                    }}
                >
                    <div className="inventory-header flex flex-row justify-between border-b-2 border-b-amber-950 pb-1 cursor-grab">
                        <div className="flex p-1">Bag</div>
                        <div className="flex"><button className="close-inventory py-1 px-2 rounded-xs bg-amber-800 border-amber-700 border-[1px] cursor-pointer" onClick={closeInventory} >X</button></div>
                    </div>
                    <div className="relative my-2" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
                        {/* Grid de slots vacíos */}
                        <div className="absolute inset-0">
                            {Array.from(inventory.itemPositions.entries()).map(([slotId, position]) => (
                                <div 
                                    key={`slot-${slotId}`}
                                    className={`absolute w-8 h-8 border ${
                                        inventory.items.has(slotId) 
                                            ? 'border-amber-950 opacity-10' 
                                            : 'border-amber-800 opacity-25'
                                    }`}
                                    style={{
                                        left: `${position.x}px`,
                                        top: `${position.y}px`,
                                        pointerEvents: 'none' // Importante: permite que los eventos pasen a través
                                    }}
                                />
                            ))}
                        </div>

                        {/* Items */}
                        <InventoryItemList inventory={inventory} />
                    </div>
                    <div className="flex flex-row justify-between border-t-2 border-t-amber-950 pt-2">
                        <div className="flex">{inventory.items.size}/{inventory.slots}</div>
                        <div className="flex">{inventory.currentWeight}/{inventory.maxWeight} Kg</div>
                    </div>
                </div>
        </Draggable>
    );
};


export default PlayerInventory;