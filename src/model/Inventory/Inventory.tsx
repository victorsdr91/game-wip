import { ItemGroup } from "model/Item/ItemGroup";
import { InventoryProps } from "./contract";
import { Item } from "model/Item/Item";


export class Inventory {

    private items: Array<ItemGroup>;
    private slots: number;
    private maxWeight: number;
    private currentWeight: number;

    constructor({items, slots, maxWeight, currentWeight}: InventoryProps) {
        this.slots = slots;
        this.maxWeight = maxWeight;
        this.currentWeight = currentWeight;
        this.items = new Array<ItemGroup>();
        items?.forEach((group, index) => {
            if(index < this.items.length) {
                this.items[index] = new ItemGroup({
                    item: group.item,
                    quantity: group.quantity,
                    stack: group.stack,
                });
            }
        })
    }

    public addItem(item: Item): void {
        const itemProps = item.getItemProps();
        if(this.items.length < this.slots && this.currentWeight < this.maxWeight) {
            let itemGroupToPush: ItemGroup | undefined = new ItemGroup({ item: itemProps, quantity: 1, stack: 1 });
            if(item.isAgruppable()){
                const originalGroup = this.findItemGroup(item);
                const remainingSpace = originalGroup?.addItem(item);
                if(!remainingSpace) {
                    itemGroupToPush = new ItemGroup({ item: itemProps, quantity: 1, stack: originalGroup?.getStack() || 20});
                    itemGroupToPush?.addItem(item);
                    this.items.push(itemGroupToPush);
                }
            } else {
                itemGroupToPush?.addItem(item);
                this.items.push(itemGroupToPush);
                
            }
            this.currentWeight+= item.getWeight();
        }
    }

    private findItemGroup(item: Item): ItemGroup | undefined {
        return this.items.find((itemGroup) => itemGroup.getItem().equals(item));
    }

    public removeItem(itemGroup: ItemGroup): void {
        if(this.items.length < this.slots) {
            const originalItemGroup = this.findItemGroup(itemGroup.getItem());
            originalItemGroup?.removeQuantity(itemGroup.getQuantity());
            if(originalItemGroup?.getQuantity() == 0) {
                this.items.splice(0, 1, originalItemGroup);
            }
            this.currentWeight -= itemGroup.getWeight();
        }
    }
}