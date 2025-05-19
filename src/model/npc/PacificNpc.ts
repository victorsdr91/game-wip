import { CollisionGroupManager, CollisionType } from "excalibur";
import { Npc } from "./Npc";
import { PacificNpcType } from "./contract";

const npcGroupMask = CollisionGroupManager.create('npcGroup')

export class PacificNpc extends Npc {
    private dialogue: Array<string>;

    constructor({ npcName, pos, sprite, spriteSize, dialogue, stats, eventEmitter}: PacificNpcType) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          collisionType: CollisionType.Fixed,
          collisionGroup: npcGroupMask,
          stats,
          eventEmitter,
        });
        this.dialogue = dialogue;
    }
}