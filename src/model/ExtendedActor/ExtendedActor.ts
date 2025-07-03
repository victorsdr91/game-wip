import { Actor, CollisionGroup, Color, EventEmitter, Font, Text, TextAlign, Vector } from "excalibur";
import { ExtendedActorType } from "./contract";
import HealthComponent from "services/systems/Health/components/HealthComponent";
import StatsComponent from "services/systems/common/components/StatsComponent";
import { ExperienceComponent } from "services/systems/common/components/ExperienceComponent";
import { MovementComponent } from "services/systems/Movement/components/MovementComponent";
import { MovementDirection, MovementMode } from "services/systems/Movement/types/movement.enum";
import { StatsEnum } from "services/systems/common/components/types/stats.enum";

export abstract class ExtendedActor extends Actor {
  protected nameTextGraphic: Text;

  protected stats: StatsComponent;
  protected health: HealthComponent;
  protected experience: ExperienceComponent;
  protected movement: MovementComponent;

  readonly _group: CollisionGroup;

  constructor({ name, pos, width, height, collisionType, collisionGroup, stats, maxHealth, currentHealth}: ExtendedActorType) {
    super({
      pos,
      width,
      height,
      collisionType,
      collisionGroup,
    });
    this.name = name;
    this.nameTextGraphic = new Text({ text: this.name, font: new Font({size: 8, color: Color.White, textAlign: TextAlign.Center})});
    this.stats = new StatsComponent();
    for(const [key, value] of Object.entries(stats)) {
      this.stats.setStat(StatsEnum[key as keyof typeof StatsEnum], value);
    }
    this.movement = new MovementComponent(16 * this.stats.getStat(StatsEnum.speed), pos);
    this.experience = new ExperienceComponent();
    this.experience.level = stats.level;
    this.health = new HealthComponent();
    this.health.maxHealth = maxHealth;
    this.health.health = currentHealth || maxHealth;

    this._group = collisionGroup;

    this.addComponent(this.stats);
    this.addComponent(this.health);
    this.addComponent(this.experience);
    this.addComponent(this.movement);
  }

  public getStats(): StatsComponent {
    return this.stats;
  }

  public getExperience(): ExperienceComponent {
    return this.experience;
  }

  public getMaxHealth(): number {
    return this.health.maxHealth;
  }

  public getHealth(): number {
    return this.health.health;
  }

  protected move(direction: MovementDirection, mode: MovementMode): void {
    this.setMovementDirection(direction);
    this.setMovementMode(mode);
    this.movement.speed = this.movement.baseSpeed * this.stats.getStat(StatsEnum.speed);
  }

  protected setMovementDirection(direction: MovementDirection) {
    this.movement.direction = direction;
  }

  protected setMovementMode(mode: MovementMode) {
    this.movement.mode = mode;
  }

  public getDirection(): MovementDirection {
    return this.movement.direction;
  }

  public getLevel(): number {
    return this.experience.level;
  }

  public equals(actor: ExtendedActor): boolean {
    return this.id === actor.id && this.name === actor.name;
  }
}
