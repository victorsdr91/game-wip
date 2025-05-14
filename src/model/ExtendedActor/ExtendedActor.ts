import { Actor, EventEmitter, Side, Vector } from "excalibur";

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
  protected target: ExtendedActor;
  protected event: EventEmitter;
  protected originalPosition: Vector;

  constructor({ pos, width, height, collisionType, collisionGroup, stats, eventEmitter}) {
    super({
      pos,
      width,
      height,
      collisionType,
      collisionGroup,
    });
    this.stats = stats;
    this.event = eventEmitter;
    this.health = this.getMaxHealth();
    this.originalPosition = pos;
  }

  public setHealth(health: number) {
    const maxHealth =  this.getMaxHealth();
    if(health >= maxHealth) {
      this.health = maxHealth;
    } else if(health <= 0) {
      this.health = 0;
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

  public getMaxHealth(): number {
    return BASE_HEALTH+(this.stats.con*CON_MULTIPLIER);
  }

  protected returnToOriginalPosition() {
      this.actions.moveTo(this.originalPosition, this.speed*this.stats.speed);
    }
}
