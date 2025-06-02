import { Animation, CollisionType, Engine, Keys, Vector, GraphicsGroup, CollisionGroupManager } from "excalibur";
import { Config } from "../../state/Config";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { animationDirection, animationMode } from "../ExtendedActor/contract";
import { PlayerAnimation } from "./PlayerAnimations";
import { keyboardType } from "../../contract";
import { PlayerProgressType, PlayerProps } from "./contract";
import { Inventory } from "model/Inventory/Inventory";


export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends ExtendedActor {
  private playerAnimation: PlayerAnimation;
  private controlMap: Object = {};
  private attackMode: number = 0;
  private progress: PlayerProgressType;
  private inventory: Inventory;

  constructor({pos, name, currentHealth, maxHealth, progress, stats, inventory, eventEmitter}: PlayerProps) {
    super({
      name,
      pos: pos,
      width: 16,
      height: 16,
      currentHealth,
      maxHealth,
      collisionType: CollisionType.Active,
      collisionGroup: PlayerCollisionGroup,
      stats,
      eventEmitter,
    });
    this.progress = progress;
    this.playerAnimation = new PlayerAnimation(this.frameSpeed);
    this.inventory = new Inventory(inventory);
    const actionsMap = {
      "movement" : {
        "left" : () => { this.move(animationDirection.LEFT, animationMode.WALK)},
        "right" : () => { this.move(animationDirection.RIGHT, animationMode.WALK)},
        "up" : () => { this.move(animationDirection.UP, animationMode.WALK)},
        "down" : () => { this.move(animationDirection.DOWN, animationMode.WALK)},
        "run" : () => { this.run() },
      },
      "skills": {
        "first": () => { this.isAttacking = true; }
      }
    };

    const controls: keyboardType = Config.getControls().keyboard;
    Object.keys(controls)
    .forEach((type) => {
      Object.keys(controls[type])
      .forEach((key) => 
        { 
          this.controlMap[controls[type][key]] = actionsMap[type][key];
        }
      )
    });

    this.handleEvents();

  }

  onInitialize() {
    this.playerAnimation.initialize();
    const attacks = this.playerAnimation.getAttackAnimations();
    console.log("Player inventory loaded: \n", this.inventory);

    Object.values(attacks).forEach((attackDirection) => {
      attackDirection.forEach((attack) => {
        attack.events.on("loop", () => {
          this.isAttacking = false;
          this.playerBasicAttack();
        });
      });
    });

    const dieAnimation = this.playerAnimation.useDieAnimation();
    dieAnimation.events.on('end', () => {
      setTimeout(() => {
        console.log("Player health depleted, resetting player...");
        this.eventManager.emit('player-health-depleted', {callback: this.resetPlayer });
      }, 1500);
    })
  }

  handleEvents() {
    this.handleNpcBasicAttack();
    this.handleMonsterRewards();
  }

  handleNpcBasicAttack() {
    this.eventManager.on("npc-attack-basic", ({ pos, range, damage, actor}) => {
      let diff = this.pos.sub(pos);
      if (diff.distance() > range) {
        return;
      }
      const healthAfterDamage = this.receiveDamage(damage, actor);
      this.updateHealth(healthAfterDamage);
    });
  }

  handleMonsterRewards() {
    this.eventManager.on("npc-aggresive-died", ({ actor, rewards}) => {
      if(this.name === actor.name) {
        if(rewards.exp) {
          this.progress.exp += rewards.exp;
          console.log(`${this.name} has received ${rewards.exp} experience points`);
          this.isLvlUp(this.progress.exp) && this.lvlUp();
        }
      }
    });
  }

  isLvlUp(exp: number): boolean {
    return exp >= this.progress.expNextLevel;
  }
  
  lvlUp() {
    this.stats.level++;
    const diffExp = this.progress.exp - this.progress.expNextLevel;
    this.progress.exp = diffExp;
    this.progress.expNextLevel += (this.progress.expNextLevel*1.5)+50;

    this.eventManager.emit('player-lvl-update', {newLvl: this.stats.level});
  }

  private playerBasicAttack() {
    if(++this.attackMode > 2) {
      this.attackMode = 0;
    }

    const eventData = {
      actor: this,
      pos: this.pos,
      direction: this.direction,
      range: 20,
      damage: this.stats.f_attack*this.stats.level,
    }
    this.eventManager.emit("player-attack-basic", eventData);
  }

  private run(): void {
    this.isRunning = true;
    this.movementMode = animationMode.RUN;
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.vel = Vector.Zero;
    this.movementSpeed = this.isRunning ? this.originalSpeed * 2 : this.originalSpeed;
    this.movementMode = animationMode.IDLE;

    const runKey = Config.getControls().keyboard.movement.run as Keys;

    if(this.isRunning && !engine.input.keyboard.isHeld(runKey)) {
      this.isRunning = false;
      this.movementMode = animationMode.WALK;
    }
    Object.values(Keys)
      .filter((key) => 
        engine.input.keyboard.isHeld(key)
      )
      .forEach((key) => 
        { 
          this.controlMap[key] && this.controlMap[key]();
        }
      );
    let animationGraphic = this.playerGraphic(this.playerAnimation.usePlayerAnimation({ mode: this.movementMode, direction: this.direction}));
    
    if(this.isAttacking) {
      animationGraphic = this.playerGraphic(this.playerAnimation.useAttackAnimation(this.direction, this.attackMode || 0));
    } else if(this.isDead) {
      animationGraphic = this.playerGraphic(this.playerAnimation.useDieAnimation());
    }

    this.graphics.use(animationGraphic);
  }

  protected playerGraphic(animation: Animation): GraphicsGroup {
    const graphicsGroup = new GraphicsGroup({
      useAnchor: true,
      members: [
        {
          graphic: animation,
          offset: new Vector(0, 8),
        },
        {
          graphic: this.nameTextGraphic,
          offset: new Vector(16, -4),
        },
        
      ]
    });
    
    graphicsGroup.width = 32;
    return graphicsGroup;
  }

  private updateHealth(health: number): void {
    this.setHealth(health);
    this.eventManager.emit('player-health-update', {health: this.getHealth()});
  }

  public resetPlayer = () => {
    this.pos = this.originalPosition;
    this.isDead = false;
    this.direction = animationDirection.DOWN;
    this.updateHealth(this.getMaxHealth());
  }
}
