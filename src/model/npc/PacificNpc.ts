import { CollisionGroupManager, CollisionType } from "excalibur";
import { Npc } from "./Npc";
import { PacificNpcType } from "./contract";

const npcGroupMask = CollisionGroupManager.create('npcGroup')

export class PacificNpc extends Npc {
    private dialogue: Array<string>;

    constructor({ name, pos, sprite, spriteSize, dialogue, stats, currentHealth, maxHealth, eventEmitter}: PacificNpcType) {
        super({
          name,
          pos,
          sprite,
          spriteSize,
          collisionType: CollisionType.Fixed,
          collisionGroup: npcGroupMask,
          stats,
          currentHealth,
          maxHealth,
          eventEmitter,
        });
        this.dialogue = dialogue;
    }
}