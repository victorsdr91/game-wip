import { Actor, Color, EventEmitter, Font, Text, TextAlign, Vector } from "excalibur";
import { ActorStats, AnimationDirection, AnimationMode, ExtendedActorType } from "./contract";

export abstract class ExtendedActor extends Actor {
  protected nameTextGraphic: Text;

  protected stats: ActorStats;
  protected speed: number = 16;
  protected movementSpeed: number = 0;
  protected frameSpeed: number = 200; // ms
  protected currentHealth: number;
  protected maxHealth: number;
  protected target: ExtendedActor | undefined;
  protected eventEmitter: EventEmitter;
  protected originalPosition: Vector;
  protected originalSpeed: number;

  protected movementMode: AnimationMode = AnimationMode.IDLE;
  protected direction: AnimationDirection = AnimationDirection.DOWN;

  protected isAttacking: boolean = false;
  protected isRunning: boolean = false;
  protected isDead: boolean;

  constructor({ name, pos, width, height, collisionType, collisionGroup, stats, maxHealth, currentHealth, eventEmitter}: ExtendedActorType) {
    super({
      pos,
      width,
      height,
      collisionType,
      collisionGroup,
    });
    this.name = name;
    this.nameTextGraphic = new Text({ text: this.name, font: new Font({size: 8, color: Color.White, textAlign: TextAlign.Center})});
    this.stats = Object.assign({}, stats);
    this.eventEmitter = eventEmitter;
    this.maxHealth = maxHealth;
    this.currentHealth = currentHealth || maxHealth;
    this.originalPosition = pos;
    this.originalSpeed = this.speed * this.stats.speed;
    this.isDead = this.currentHealth <= 0;
  }

  public setHealth(health: number) {
    const maxHealth =  this.getMaxHealth();
    if(health >= maxHealth) {
      this.currentHealth = maxHealth;
    } else if(health <= 0) {
      this.currentHealth = 0;
    } else {
      this.currentHealth = health;
    }
  }

  public getHealth(): number {
    return this.currentHealth;
  }

  public getStats(): ActorStats {
    return this.stats;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  protected returnToOriginalPosition(): void {
      this.actions.moveTo(this.originalPosition, this.speed*this.stats.speed);
  }

  protected setTarget(actor: ExtendedActor): void {
    this.target = actor;
  }

  protected removeTarget(): void {
    this.target = undefined;
  }

  public receiveDamage (damage: number, actor: ExtendedActor): number {
    const damageReceived = damage - this.stats.f_defense*this.stats.level*0.5;
    const totalDamage = damageReceived > 0 ? damageReceived : 0;
    this.setHealth(this.getHealth() - totalDamage);
    
    if(this.getHealth() <= 0) {
      this.die();
    }

    return this.getHealth();
  }

  protected setDirection(direction: AnimationDirection) {
    this.direction = direction;
  }

  public getDirection(): AnimationDirection {
    return structuredClone(this.direction);
  }

  protected move(direction: AnimationDirection, mode: AnimationMode): void {
    this.movementMode = this.movementMode !== AnimationMode.RUN ? mode : this.movementMode;
    this.setDirection(direction);
    const isXMovement = this.direction === AnimationDirection.RIGHT || this.direction === AnimationDirection.LEFT;
    let x = 0;
    let y = 0;
    if(isXMovement) {
      x = direction === AnimationDirection.RIGHT ? this.movementSpeed : -this.movementSpeed;
    }
    else {
      y = direction === AnimationDirection.DOWN ? this.movementSpeed : -this.movementSpeed;
    }

    this.vel = new Vector(x, y);
  }

  protected die(): void {
    this.isDead = true;
  }

  public equals(actor: ExtendedActor): boolean {
    return this.id === actor.id && this.name === actor.name;
  }
}
