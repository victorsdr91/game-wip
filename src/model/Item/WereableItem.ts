import { ItemStats, SlotType, WereableItemProps } from "./contract";
import { Item } from "./Item";

export class WereableItem extends Item {
    private slot: SlotType;
    private stats?: ItemStats;
    private durability: number; // Optional property for durability
    private maxDurability: number; // Optional property for maximum durability
    private equipped: boolean; // Optional property to check if the item is equipped
    
    constructor({id, name, description, cooldown, type, weight, agruppable, slot, stats, durability, maxDurability, isEquipped}: WereableItemProps) {
        super({
            id,
            name,
            description,
            cooldown,
            type,
            weight,
            agruppable
        });

        this.stats = stats;
        this.durability = durability;
        this.maxDurability = maxDurability;
        this.equipped = isEquipped || false; // Default to false if not provided
        this.slot = slot;
    }
    public getSlot(): SlotType {
        return this.slot;
    }

    public getStats(): ItemStats | undefined {
        return this.stats;
    }

    public setStats(stats: ItemStats | undefined): void {
        this.stats = stats;
    }

    public getDurability(): number {
        return this.durability;
    }

    public setDurability(durability: number): void {
        this.durability = durability;
    }

    public getMaxDurability(): number {
        return this.maxDurability;
    }

    public isEquipped(): boolean {
        return this.equipped;
    }

    public equip(): void {
        this.equipped = true;
    }

    public removeFromEquipment(): void {
        this.equipped = false;
    }
}