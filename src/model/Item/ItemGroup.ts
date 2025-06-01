import { ItemGroupProps} from "./contract";
import { ItemInterface } from "./interface/ItemInterface";

export class ItemGroup {
    private item: ItemInterface;
    private quantity: number;
    private stack: number;
    private weight: number;

    constructor({item, quantity, stack}: ItemGroupProps) {
        this.item = item;
        this.quantity = Math.min(quantity, stack);
        this.stack = stack;
        this.weight = this.item.getWeight()*quantity;
    }

    public addQuantity(quantity: number): number {
        const availableSpace = this.stack - this.quantity;
        const addedQuantity = Math.min(quantity, availableSpace);
        this.quantity += addedQuantity;
        return quantity - addedQuantity; // Return remaining quantity that couldn't be added
    }

    public removeQuantity(quantity: number): number {
        const removedQuantity = Math.min(this.quantity, quantity);
        this.quantity -= removedQuantity;
        return this.quantity;
    }

    equals(itemGroup: ItemGroup): boolean {
        return this.item.equals(itemGroup.item);
    }

    public isFull(): boolean {
        return this.quantity >= this.stack;
    }

    public getItem(): ItemInterface {
        return this.item;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getWeight(): number {
        return this.weight;
    }

    public getStack(): number {
        return this.stack;
    }
}