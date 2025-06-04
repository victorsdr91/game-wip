import { ItemGroup } from "model/Item/ItemGroup";
import { PlayerEquipmentProps } from "./contract";
import { ItemFactory } from "factory/Item/ItemFactory";
import { SlotType } from "model/Item/contract";

export class PlayerEquipment {
    private _equipment: Partial<Record<SlotType, ItemGroup>>;

    constructor({ equipment }: PlayerEquipmentProps = {}) {
        this._equipment = {};
        if (equipment) {
            for (const slot in equipment) {
                const { itemId, quantity } = equipment[slot];
                this.addEquipment(slot, itemId, quantity);
            }
        }        
    }

    public get equipment(): Record<string, ItemGroup> {
        return this._equipment;
    }

    private addEquipment(slot: string, itemId: number, quantity: number): void {
        const item = ItemFactory.getItemById(itemId);
        if( item ) {
            const itemGroup = new ItemGroup({ item, quantity });
            this._equipment[slot] = itemGroup;
        }
    }

    public setEquipment(slot: string, itemGroup: ItemGroup): void {
        this._equipment[slot] = itemGroup;
    }

    public getEquipment(slot: string): ItemGroup | undefined {
        return this._equipment[slot];
    }

    public removeEquipment(slot: string): void {
        delete this._equipment[slot];
    }
}