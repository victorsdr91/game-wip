import { Npc } from "./Npc";
import { PacificNpcType } from "./contract";
export declare class PacificNpc extends Npc {
    private dialogue;
    constructor({ npcName, pos, sprite, spriteSize, dialogue, stats, eventEmitter }: PacificNpcType);
}
