import React, { useEffect, useRef, useState, FC } from "react";
import { HudPlayerEvents } from "state/helpers/PlayerEvents";
import { ItemGroup } from "model/Item/ItemGroup";
import { Inventory } from "./contract";
import { useGameEvent } from "app/clientState/hooks/useGameEvent/useGameEvent";
import InventoryItemList from "./InventoryItemList";

const PlayerInventory = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [showIventory, setShowInventory] = useState<boolean>(false);
    
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

    useEffect(() => {
        if (!gridRef.current) return;

        // Obtener dimensiones reales de los slots renderizados
        const slotElements = gridRef.current.querySelectorAll('.inventory-slot');
        if (slotElements.length === 0) return;

        const cellWidth = 32; // w-8 = 32px
        const cellHeight = 32;
        const gap = 8; // 8px de gap
        const columns = 8;
        const rows = Math.ceil(inventory.slots / columns);

        // Actualizar slots con dimensiones reales
        const updatedSlots = Array.from(inventory.itemPositions.entries()).map(([index]) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            return {
                index,
                position: {
                    x: col * (cellWidth + gap),
                    y: row * (cellHeight + gap)
                },
                dimensions: {
                    width: cellWidth,
                    height: cellHeight,
                    gap
                }
            };
        });
    }, [inventory.slots]);    

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

    const dimensions = calculateInventoryDimensions();

    return (
        <div className={`absolute ${showIventory ? "block" : "hidden"} p-3 bg-amber-900 text-amber-200 text-[8px] border-amber-950 border-3 rounded-md top-[150px] left-[350%]`}>
            <div className="flex flex-row justify-between border-b-2 border-b-amber-950 pb-1">
                <div className="flex p-1">Bag</div>
                <div className="flex"><button className="p-1" onClick={()=> console.log("close bag")} >X</button></div>
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
    );
};


export default PlayerInventory;