import { ItemProps, ItemType } from "./contract";

export class Item {
    private id: number;
    private agruppable: boolean;
    private name: string;
    private description: string;
    private cooldown: number; //ms
    private type: ItemType;
    private weight: number;

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

    public getItemProps(): ItemProps {
        return {
            id: this.getId(),
            name: this.getName(),
            description: this.getDescription(),
            cooldown: this.getCooldown(),
            type: this.getType(),
            agruppable: this.isAgruppable(),
            weight: this.getWeight(),
        }
    }
}