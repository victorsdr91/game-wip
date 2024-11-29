import { CollisionType } from "excalibur";
import { Npc } from "./Npc";

export class PacificNpc extends Npc {
    private dialogue: Array<string>;

    constructor({ npcName, pos, sprite, spriteSize, dialogue, stats}) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          collisionType: CollisionType.Fixed,
          stats,
        });
        this.dialogue = dialogue;
    }
}