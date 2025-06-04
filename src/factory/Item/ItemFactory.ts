
import { ItemClass, ItemProps, WereableItemProps } from "model/Item/types/ItemTypes";
import { Item } from "../../model/Item/Item";
import { WereableItem } from "../../model/Item/WereableItem";

export class ItemFactory {
    private static items: Map<number, ItemClass> = new Map();
    
    constructor() {
        throw new Error("ItemFactory is a static class and cannot be instantiated.");   
    };

    public static loadItems(items: Array<any>): void {
        console.log("Loading items...");

        items.forEach((itemData: any) => {
            const item: Item | WereableItem  = this.createItem(itemData);
            this.items.set(item.getId(), item);
        });
    }

    public static createItem(itemData: any): ItemClass {
        if (itemData.slot) {
            // Create a WereableItem
            return new WereableItem(itemData as WereableItemProps);
        } else {
            // Create a regular Item
            return new Item(itemData as ItemProps);
        }
    }

    public static getItemById(id: number): ItemClass | undefined {
        return this.items.get(id);
    }
}