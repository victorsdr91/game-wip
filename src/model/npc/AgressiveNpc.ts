import { CollisionGroupManager } from "excalibur";
import { Npc } from "./Npc";

export const EnemiesCollisionGroup = CollisionGroupManager.create('enemies');

export class AgressiveNpc extends Npc {

    private attacking: boolean = false;
    private taunted: boolean = false; 

    constructor({ npcName, pos, sprite, spriteSize, stats, collisionType}) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          stats,
          collisionType,
        });
    }

    public isTaunted(): boolean {
      return this.taunted;
    }

    public toggleTaunted(): void {
      this.taunted = !this.taunted;
    }

    public isAttacking(): boolean {
      return this.attacking;
    }

    public toggleAttacking(): void {
      this.attacking = !this.attacking;
    }
}