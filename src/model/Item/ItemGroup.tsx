import { ItemGroupProps, ItemProps, ItemType } from "./contract";
import { Item } from "./Item";

export class ItemGroup {
    private item: Item;
    private quantity: number;
    private stack: number;
    private weight: number;

    constructor({item, quantity, stack}: ItemGroupProps) {
        this.item = item;
        this.quantity = quantity;
        this.stack = stack;
        this.weight = item.getWeight()*quantity;
    }

    public addItem(item: Item): number | null {
        if(item.equals(this.item) && !this.isFull()) {
            return this.quantity++;
        }
        return null;
    }

    public removeItem(item: Item, quantity: number): number {
        if(item.equals(this.item) && this.quantity > 0) {
            return this.quantity -= quantity;
        }
        return -1;
    }

    equals(itemGroup: ItemGroup): boolean {
        return this.item.equals(itemGroup.item);
    }

    public isFull(): boolean {
        return this.quantity >= this.stack;
    }

    public getItem(): Item {
        return this.item;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getWeight(): number {
        return this.weight;
    }

    public addQuantity(newQuantity: number): number {
        if(newQuantity > this.stack) {
            return newQuantity - this.stack;
        }
        this.quantity = newQuantity;
        return 0;
    }

    public removeQuantity(substracQuantity: number): number {
        if(substracQuantity - this.stack <= 0) {
            return 0;
        }
        this.quantity -= substracQuantity;
        return this.quantity;
    }

    public getStack(): number {
        return this.stack;
    }
}