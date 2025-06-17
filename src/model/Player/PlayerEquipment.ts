import { ItemGroup } from "model/Item/ItemGroup";
import { EquipmentSlotsType, EquipmentType, PlayerEquipmentProps } from "./contract";
import { ItemFactory } from "factory/Item/ItemFactory";
import { SlotType } from "./types/SlotType.enum";

export class PlayerEquipment {
    private _equipment: EquipmentType;
    private _equipmentSlots: EquipmentSlotsType;

    constructor({ equipment }: PlayerEquipmentProps = {}) {
        this._equipment = {};
        this._equipmentSlots = new Map();

        const arraySlotType = Array.from(Object.keys(SlotType));
        const jumpToColumn = (arraySlotType.length - 4) / 2;

        for(var i = 0; i < arraySlotType.length - 4; i++ ) {
            arraySlotType.length
            this._equipmentSlots.set(SlotType[arraySlotType[i]], {
                x: Math.floor(i / jumpToColumn) * 220,
                y: (i % jumpToColumn) * 40
            });
        }

        for(var i = arraySlotType.length - 4; i < arraySlotType.length - 1; i++ ) {
            this._equipmentSlots.set(SlotType[arraySlotType[i]], {
                x: Math.floor((i+4 - arraySlotType.length) % 3) * 40 + 70,
                y: 160
            });
        }

        if (equipment) {
            for (const slot in equipment) {
                const { itemId, quantity } = equipment[slot];
                this.addEquipment(slot, itemId, quantity);
            }
        }        
    }

    public get equipment(): EquipmentType {
        return this._equipment;
    }

    public get equipmentSlots(): EquipmentSlotsType {
        return this._equipmentSlots;
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