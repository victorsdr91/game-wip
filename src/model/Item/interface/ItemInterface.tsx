import { ImageSource } from "excalibur";
import { ItemType } from "../types/ItemTypes.enum";
import { ItemStats } from "../contract";

export interface ItemInterface {
    getId(): number;
    getName():string;
    getDescription():string;
    getWeight():number;
    getType():ItemType;
    getCooldown():number;
    getStackSize():number;
    getIcon(): ImageSource | undefined; 
    getSprite(): ImageSource | undefined
    getStats?(): ItemStats;
    isAgruppable():boolean;
    equals(item: ItemInterface): boolean;
}