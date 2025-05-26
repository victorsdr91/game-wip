import { ItemProps, ItemType } from "./contract";

export class Item {
    private id: number;
    public name: string;
    public description: string;
    public cooldown: number;
    public type: ItemType;

    constructor({id, name, description, cooldown, type}: ItemProps) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.type = type;
    }

    equals(item: Item): boolean {
        return item.id === this.id;
    }

}