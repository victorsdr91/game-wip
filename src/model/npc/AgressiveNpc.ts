import { CollisionGroupManager } from "excalibur";
import { Npc } from "./Npc";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { RewardType } from "../../scenes/Level1/contract";

export const EnemiesCollisionGroup = CollisionGroupManager.create('enemies');

export type Drop = {
  id: number,
  name: string,
  quantity: number,
  probability: number,
 
}

export class AgressiveNpc extends Npc {

    protected attacking: boolean = false;
    protected taunted: boolean = false;
    protected rewards: RewardType;

    constructor({ npcName, pos, sprite, spriteSize, stats, rewards, collisionType, eventEmitter}) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          stats,
          collisionType,
          collisionGroup: EnemiesCollisionGroup,
          eventEmitter,
        });

        this.rewards = rewards;
        eventEmitter.on('player-health-depleted', () => {
          this.taunted = false;
          this.returnToOriginalPosition();
          this.passiveHeal();
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

    protected passiveHeal(): void {
      if(!this.isTaunted()) {
          const interval = setInterval(() => {
            if(this.getHealth() >= this.getMaxHealth()) {
              clearInterval(interval);
            }
            const currentHealth = this.getHealth();
            const pointsToRecover = this.getMaxHealth()*0.15;
            this.setHealth(currentHealth + pointsToRecover);
            this.hpGraphic.text = `${this.getHealth()}`;
          }, 1000);
        
      }
    }

    protected calculateDamage(attacker: ExtendedActor, defender: ExtendedActor): number {
        const attackerStats = attacker.getStats();
        const defenderStats = defender.getStats();
        const damageDealt = (attackerStats.f_attack*attackerStats.level - defenderStats.f_defense*defenderStats.level);
        return damageDealt > 0 ? damageDealt : 0;
    }

    protected receiveDamage (damage: number, actor: ExtendedActor): void {
      const damageReceived = damage - this.stats.f_defense*this.stats.level;
      const totalDamage = damageReceived > 0 ? damageReceived : 0;
      this.setHealth(this.getHealth() - totalDamage);
      this.hpGraphic.text = `${this.getHealth()}`;

      if(!this.isTaunted()) {
        this.taunted = true;
        this.target = actor;
      }
    }
}