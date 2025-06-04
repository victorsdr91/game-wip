import { ItemInterface } from "./interface/ItemInterface";
import { ItemType } from "./types/ItemTypes.enum";
import { ItemProps } from "./types/ItemTypes";

export class Item implements ItemInterface {
    private id: number;
    private agruppable: boolean;
    private name: string;
    private description: string;
    private cooldown: number; //ms
    private type: ItemType;
    private weight: number;
    private stackSize: number = 1; // Default stack size, can be modified later
    private effect: any; // Placeholder for future effects

    constructor({id, name, description, cooldown, type, weight, agruppable, stackSize}: ItemProps) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.type = type;
        this.weight = weight;
        this.agruppable = agruppable || false;
        this.stackSize = stackSize || 1; // Default stack size
    }

    public isAgruppable():boolean {
        return this.agruppable;
    }

    equals(item: ItemInterface): boolean {
        return item.getId() === this.getId();
    }

    public getName() {
        return this.name;
    }

    public getDescription() {
        return this.description;
    }

    public getWeight(): number {
        return this.weight;
    }

    public getType(): ItemType {
        return this.type;
    }

    public getCooldown(): number {
        return this.cooldown;
    }

    public getStackSize(): number {
        return this.stackSize;
    }

    public getId(): number {
        return this.id;
    }
}