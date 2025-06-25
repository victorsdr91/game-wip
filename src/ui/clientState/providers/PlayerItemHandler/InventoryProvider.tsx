import React, { createContext, useContext, FC, ReactNode } from 'react';
import { ItemGroup } from 'model/Item/ItemGroup';
import { Inventory } from 'ui/components/PlayerHud/PlayerInventory/contract';
import { HudPlayerEvents } from 'state/helpers/PlayerEvents';
import { SlotType } from 'model/Player/types/SlotType.enum';
import { useGameEvent } from 'ui/clientState/hooks/useGameEvent/useGameEvent';
import { Game } from 'services/Game';

interface InventoryContextType {
    inventory: Inventory;
    findInventorySlot: (itemGroup: ItemGroup) => number | null;
    equipItem: (itemGroup: ItemGroup, toSlot: SlotType) => void;
    unequipItem: (fromSlot: SlotType, itemGroup: ItemGroup) => void;
    dropItem: (fromSlot: number) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = React.useState<Inventory>({ 
        items: new Map<number, ItemGroup>(), 
        itemPositions: new Map<number, { x: number, y: number }>(),
        slots: 32, 
        maxWeight: 0, 
        currentWeight: 0,
        findFirstEmptySlot: () => 0
    });

    useGameEvent({
        event: HudPlayerEvents.HUD_PLAYER_INVENTORY_UPDATE,
        callback: (newInventory) => {
            setInventory(newInventory);
        }
    });

    const findInventorySlot = (itemGroup: ItemGroup): number | null => {
        for (const [slotId, group] of inventory.items.entries()) {
            if (group === itemGroup) {
                return slotId;
            }
        }
        return null;
    };

    const equipItem = (itemGroup: ItemGroup, toSlot: SlotType) => {
        const fromSlot = findInventorySlot(itemGroup);
        if (fromSlot !== null) {
            Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_EQUIP_ITEM, {
                fromSlot,
                toSlot,
                itemGroup
            });
        }
    };

    const unequipItem = (fromSlot: SlotType, itemGroup: ItemGroup) => {
        const toSlot = inventory.findFirstEmptySlot();
        if (toSlot !== null) {
            Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_UNEQUIP_ITEM, {
                fromSlot,
                toSlot,
                itemGroup
            });
        }
    };

    const dropItem = (fromSlot: number) => {
        const shouldDrop = window.confirm('¿Deseas eliminar este objeto?');
        if (shouldDrop) {
            Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_INVENTORY_ITEM_DROPPED, {
                fromSlot
            });
        }
    };

    return (
        <InventoryContext.Provider value={{
            inventory,
            findInventorySlot,
            equipItem,
            unequipItem,
            dropItem
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};