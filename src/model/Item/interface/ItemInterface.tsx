import { ItemType } from "../contract";

export interface ItemInterface {
    getId(): number;
    getName():string;
    getDescription():string;
    getWeight():number;
    getType():ItemType;
    getCooldown():number;
    getStackSize():number;
    isAgruppable():boolean;
    equals(item: ItemInterface): boolean;
}