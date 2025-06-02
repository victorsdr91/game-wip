import { ItemType } from "../contract";

export interface ItemInterface {
    getName():string;
    getDescription():string;
    getWeight():number;
    getType():ItemType;
    getCooldown():number;
    getId():number;
    isAgruppable():boolean;
    equals(item: ItemInterface): boolean;
}