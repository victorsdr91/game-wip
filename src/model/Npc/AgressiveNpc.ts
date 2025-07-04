import { CollisionGroupManager, ImageSource } from "excalibur";
import { Npc } from "./Npc";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { RewardType } from "../../scenes/Test/contract";
import { AgressiveNpcType } from "./contract";
import { HudPlayerEvents } from "state/helpers/PlayerEvents";

export const EnemiesCollisionGroup = CollisionGroupManager.create('enemies');

export class AgressiveNpc extends Npc {

    protected attacking: boolean = false;
    protected taunted: boolean = false;
    protected rewards: RewardType;

    constructor({ name, pos, sprite, spriteSize, stats, currentHealth, maxHealth, rewards, collisionType, eventEmitter}: AgressiveNpcType) {
        super({
          name,
          pos,
          sprite,
          spriteSize,
          stats,
          currentHealth,
          maxHealth,
          collisionType,
          collisionGroup: EnemiesCollisionGroup,
          eventEmitter,
        });

        this.rewards = rewards;
        eventEmitter.on(HudPlayerEvents.HUD_PLAYER_HEALTH_DEPLETED, () => {
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

    protected receiveDamageFromPlayer (damage: number, actor: ExtendedActor): void {
      const healthAfterDamage = this.receiveDamage(damage, actor);
      this.setHealth(healthAfterDamage);
      this.hpGraphic.text = `${this.getHealth()}`;

      if(!this.isTaunted()) {
        this.taunted = true;
        this.target = actor;
      }
    }
}