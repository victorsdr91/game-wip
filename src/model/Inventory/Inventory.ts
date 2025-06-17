import { ItemGroup } from "model/Item/ItemGroup";
import { InventoryProps } from "./contract";
import { ItemFactory } from "../../factory/Item/ItemFactory";
import { Game } from "services/Game";
import { HudPlayerEvents, InventoryEventPayload } from "state/helpers/PlayerEvents";

export class Inventory {

    private items: Map<number, ItemGroup>;
    private itemPositions: Map<number, { x: number, y: number }>;
    private game: Game;
    private slots: number;
    private maxWeight: number;
    private currentWeight: number;

    constructor({slots, maxWeight, items}: InventoryProps) {
        this.game = Game.getInstance();
        this.slots = slots;
        this.maxWeight = maxWeight;
        this.items = new Map();
        this.itemPositions = new Map();
        this.currentWeight = 0;

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

        this.setupEventListeners();

        this.emitInventoryUpdate();
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
        return true;
    }

    private setupEventListeners(): void {
        this.game.on(HudPlayerEvents.HUD_PLAYER_INVENTORY_ITEM_MOVED, (event: unknown) => {
            const { fromSlot, toSlot } = event as { 
                fromSlot: number;
                toSlot: number;
            };
            this.updateItemPosition(fromSlot, toSlot);
        });

        this.game.on(HudPlayerEvents.HUD_PLAYER_INVENTORY_ITEM_DROPPED, (event: unknown) => {
        const { fromSlot } = event as { fromSlot: number };
        this.removeItem(fromSlot);
        this.emitInventoryUpdate();
    });
    }

    public emitInventoryUpdate(): void {
        const payload: InventoryEventPayload = {
            slots: this.slots,
            maxWeight: this.maxWeight,
            currentWeight: this.currentWeight,
            items: this.items,
            itemPositions: this.itemPositions,
            findFirstEmptySlot: () => { return this.findFirstEmptySlot() },
        };
        
        this.game.emit(HudPlayerEvents.HUD_PLAYER_INVENTORY_UPDATE, payload);
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
        
        this.emitInventoryUpdate();
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
        this.items.delete(slotId);
        this.emitInventoryUpdate();
    }

    public addItemToFirstEmptySlot(itemGroup: ItemGroup): boolean {
        const emptySlot = this.findFirstEmptySlot();
        if (emptySlot === null) return false;

        this.items.set(emptySlot, itemGroup);
        this.emitInventoryUpdate();
        return true;
    }

    private findItemSlot(itemGroup: ItemGroup): number | null {
        for (const [slotId, group] of this.items.entries()) {
            if (group === itemGroup) {
                return slotId;
            }
        }
        return null;
    }

    public dropItem(itemId: number): void {
        if (this.items.has(itemId)) {
            this.items.delete(itemId);
            this.itemPositions.delete(itemId);
            this.emitInventoryUpdate();
        }
    }

    public addItem(itemId: number, quantity: number): boolean {
        const item = ItemFactory.getItemById(itemId);
        if (!item) return false;

        // Si el item es agrupable, buscar slots con el mismo tipo de item
        if (item.isAgruppable()) {
            for (const [slotId, itemGroup] of this.items) {
                if (itemGroup.getItem().getId() === itemId) {
                    const remainingQuantity = itemGroup.addQuantity(quantity);
                    if (remainingQuantity <= 0) {
                        return true;
                    }
                    quantity = remainingQuantity; // actualizar cantidad restante
                }
            }
        }

        // Si llegamos aquí, necesitamos un nuevo slot
        const emptySlot = this.findFirstEmptySlot();
        if (emptySlot === null) return false;

        return this.addItemToSlot(itemId, quantity, emptySlot);
    }

    public findItemById(itemId: number): ItemGroup | undefined {
        this.items.forEach((itemGroup) => {
            if(itemGroup) {
                if(itemGroup.getItem().getId() === itemId) {
                    return itemGroup;
                }
            }
        });
        return undefined;

    }

    public listItems(): (ItemGroup | null)[] {
        return Array.from(this.items.values());
    }

    public getCurrentWeight(): number {
        return this.currentWeight;
    }

    public getWeightLimit(): number {
        return this.maxWeight;
    }
}