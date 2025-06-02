import { ItemGroup } from "model/Item/ItemGroup";
import { InventoryProps } from "./contract";
import { ItemFactory } from "../../factory/Item/ItemFactory";

export class Inventory {

    private items: Map<number, ItemGroup>;
    private slots: number;
    private maxWeight: number;
    private currentWeight: number;

    constructor({slots, maxWeight, items}: InventoryProps) {
        this.slots = slots;
        this.maxWeight = maxWeight;
        this.items = new Map();
        this.currentWeight = 0;
        items?.forEach((itemId, quantity) => {
            this.addItem(itemId, quantity);
        });
    }

    public addItem(itemId: number, quantity: number): boolean {
        const item = ItemFactory.getItemById(itemId);
        if (!item) {
            throw new Error(`Item with ID ${itemId} not found.`);
        }

        const itemWeight = item.getWeight() * quantity;
        if (this.currentWeight + itemWeight > this.maxWeight) {
            console.error("Cannot add item: Exceeds weight limit.");
            return false;
        }

        if (this.items.has(itemId)) {
            const itemGroup = this.items.get(itemId)!;
            const remainingQuantity = itemGroup.addQuantity(quantity);
            if (remainingQuantity > 0) {
                console.error("Cannot add item: Stack limit reached.");
                return false;
            }
        } else {
            if (this.items.size >= this.slots) {
                console.error("Cannot add item: Inventory is full.");
                return false;
            }
            const stackSize = item.isAgruppable() ? 20 : 1; // Example stack size logic
            this.items.set(itemId, new ItemGroup({ item, quantity, stack: stackSize }));
        }
        this.currentWeight += itemWeight;
        return true;
    }

    public removeItem(itemId: number, quantity: number): boolean {
        if (this.items.has(itemId)) {
            const itemGroup = this.items.get(itemId)!;
            itemGroup.removeQuantity(quantity);

            const itemWeight = itemGroup.getItem().getWeight() * quantity;
            this.currentWeight -= itemWeight;

            if (itemGroup.getQuantity() <= 0) {
                this.items.delete(itemId);
            }
            return true;
        }
        return false;
    }

    public listItems(): ItemGroup[] {
        return Array.from(this.items.values());
    }

    public getCurrentWeight(): number {
        return this.currentWeight;
    }

    public getWeightLimit(): number {
        return this.maxWeight;
    }
}