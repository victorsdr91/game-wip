import { ItemProps, ItemType } from "./contract";
import { ItemInterface } from "./interface/ItemInterface";

export class Item implements ItemInterface {
    private id: number;
    private agruppable: boolean;
    private name: string;
    private description: string;
    private cooldown: number; //ms
    private type: ItemType;
    private weight: number;
    private effect: any; // Placeholder for future effects

    constructor({id, name, description, cooldown, type, weight, agruppable}: ItemProps) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.type = type;
        this.weight = weight;
        this.agruppable = agruppable || false;
    }

    public isAgruppable():boolean {
        return this.agruppable;
    }

    equals(item: Item): boolean {
        return item.id === this.id;
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

    public getId(): number {
        return this.id;
    }
}