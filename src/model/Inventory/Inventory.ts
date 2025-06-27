import { ItemGroup } from "model/Item/ItemGroup";
import { InventoryProps } from "./contract";
import { ItemFactory } from "../../factory/Item/ItemFactory";
import InventoryEventsHandler from "services/EventsHandler/InventoryEventsHandler";

export class Inventory {

    private items: Map<number, ItemGroup>;
    private itemPositions: Map<number, { x: number, y: number }>;
    private slots: number;
    private maxWeight: number;
    private currentWeight: number;
    private inventoryEventsHandler: InventoryEventsHandler;

    constructor({slots, maxWeight, items}: InventoryProps) {
        this.slots = slots;
        this.maxWeight = maxWeight;
        this.items = new Map();
        this.itemPositions = new Map();
        this.currentWeight = 0;
        this.inventoryEventsHandler = new InventoryEventsHandler({inventory: this});

        for (let slotIndex = 0; slotIndex < this.slots; slotIndex++) {
            this.itemPositions.set(slotIndex, {
                x: (slotIndex % 8) * 40, // Ajustado a 40 para coincidir con GRID_SIZE + GRID_GAP
                y: Math.floor(slotIndex / 8) * 40
            });
        }

        items?.forEach((item, slotIndex) => {
            if (slotIndex < this.slots) {
                this.addItemToSlot(item.itemId, item.quantity, slotIndex);
            }
        });

        this.inventoryEventsHandler.initialize();
    }

     public addItemToSlot(itemId: number, quantity: number, slotId: number): boolean {
        const item = ItemFactory.getItemById(itemId);
        if (!item) {
            throw new Error(`Item with ID ${itemId} not found.`);
        }

        const itemWeight = item.getWeight() * quantity;
        if (this.currentWeight + itemWeight > this.maxWeight) {
            return false;
        }

        this.items.set(slotId, new ItemGroup({ item, quantity }));
        this.currentWeight += itemWeight;

        this.inventoryEventsHandler.emitInventoryUpdate();
        return true;
    }

    public addItemToFirstEmptySlot(itemGroup: ItemGroup): boolean {
        const emptySlot = this.findFirstEmptySlot();
        if (emptySlot === null) return false;

        this.addItemToSlot(itemGroup.getItem().getId(), itemGroup.getQuantity(), emptySlot);
        this.inventoryEventsHandler.emitInventoryUpdate();
        return true;
    }


    public updateItemPosition(fromSlot: number, toSlot: number): void {
        if (fromSlot === toSlot) return;
        
        const sourceItem = this.items.get(fromSlot);
        if (!sourceItem) return;

        const targetItem = this.items.get(toSlot);

        // Intercambiar items y sus posiciones
        if (targetItem) {
            this.items.set(fromSlot, targetItem);
        } else {
            this.items.delete(fromSlot);
        }

        this.items.set(toSlot, sourceItem);

        // Importante: No necesitamos actualizar itemPositions porque las posiciones
        // están asociadas a los slots, no a los items
        
        this.inventoryEventsHandler.emitInventoryUpdate();
    }

    public findFirstEmptySlot(): number | null {
        for (let i = 0; i < this.slots; i++) {
            if (!this.items.has(i)) {
                return i;
            }
        }
        return null;
    }

    public removeItem(slotId: number): void {
        const itemGroup: ItemGroup | undefined = this.items.get(slotId);
        this.items.delete(slotId);
        this.currentWeight -= itemGroup?.getWeight() || 0;
        this.inventoryEventsHandler.emitInventoryUpdate();
    }

    public getCurrentWeight(): number {
        return this.currentWeight;
    }

    public getWeightLimit(): number {
        return this.maxWeight;
    }

    public getSlots(): number {
        return this.slots;
    }

    public getItems(): Map<number, ItemGroup> {
        return this.items;
    }

    public getItemPositions(): Map<number, { x: number, y: number }> {
        return this.itemPositions;
    }
    
}