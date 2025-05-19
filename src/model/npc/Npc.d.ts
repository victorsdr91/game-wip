import { ImageSource, Sprite, Text, Animation } from "excalibur";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { spriteSize } from "../../scenes/Level1/contract";
import { NpcType } from "./contract";
export interface npcAnimations {
    idle: {
        up: Sprite | Animation;
        down: Sprite | Animation;
        left: Sprite | Animation;
        right: Sprite | Animation;
    };
    attack?: {
        up: Sprite | Animation;
        down: Sprite | Animation;
        left: Sprite | Animation;
        right: Sprite | Animation;
    };
    die?: Sprite | Animation;
}
export declare abstract class Npc extends ExtendedActor {
    npcName: Text;
    protected sprite: ImageSource;
    protected spriteSize: {
        width: spriteSize;
        height: spriteSize;
    };
    protected animations: npcAnimations | undefined;
    hpGraphic: Text;
    constructor({ npcName, pos, sprite, spriteSize, collisionType, collisionGroup, stats, eventEmitter }: NpcType);
    onInitialize(): void;
}
