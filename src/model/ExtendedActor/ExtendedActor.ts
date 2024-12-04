import { Actor, Side } from "excalibur";

import { ActorStats } from "./contract";

const BASE_HEALTH = 100;
const CON_MULTIPLIER = 0.4;

export abstract class ExtendedActor extends Actor {
  protected stats: ActorStats;
  protected speed: number = 16;
  protected playerSpeed: number;
  protected playerFrameSpeed: 200; // ms
  private health: number;
  public colliding: boolean = false;
  public collisionSide: Side | null;

  constructor({ pos, width, height, collisionType, collisionGroup, stats}) {
    super({
      pos,
      width,
      height,
      collisionType,
      collisionGroup,
    });
    this.stats = stats;
    this.health = this.getMaxHealth();
  }

  public setHealth(health: number) {
    const maxHealth =  this.getMaxHealth();
    if(health >= maxHealth) {
      this.health = maxHealth;
    } else {
      this.health = health;
    }
  }

  public getHealth() {
    return this.health;
  }

  public getStats(): ActorStats {
    return this.stats;
  }

  private getMaxHealth(): number {
    return BASE_HEALTH+(this.stats.con*CON_MULTIPLIER);
  }

}
