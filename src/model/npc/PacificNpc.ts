import { CollisionGroupManager, CollisionType } from "excalibur";
import { Npc } from "./Npc";

const npcGroupMask = CollisionGroupManager.create('npcGroup')

export class PacificNpc extends Npc {
    private dialogue: Array<string>;

    constructor({ npcName, pos, sprite, spriteSize, dialogue, stats}) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          collisionType: CollisionType.Fixed,
          collisionGroup: npcGroupMask,
          stats,
        });
        this.dialogue = dialogue;
    }
}