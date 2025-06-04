import { ItemStats, SlotType, WereableItemProps } from "./contract";
import { Item } from "./Item";

export class WereableItem extends Item {
    private slot: SlotType;
    private stats?: ItemStats;
    private durability: number; // Optional property for durability
    private maxDurability: number; // Optional property for maximum durability
    
    constructor({id, name, description, cooldown, type, weight, agruppable, stackSize, slot, stats, durability, maxDurability}: WereableItemProps) {
        super({
            id,
            name,
            description,
            cooldown,
            type,
            weight,
            agruppable,
            stackSize,
        });

        this.stats = stats;
        this.durability = durability;
        this.maxDurability = maxDurability;
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
}