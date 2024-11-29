import { CollisionType } from "excalibur";
import { Npc } from "./Npc";

export class AgressiveNpc extends Npc {

    constructor({ npcName, pos, sprite, spriteSize, stats}) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          stats,
          collisionType: CollisionType.Active
        });
    }
}