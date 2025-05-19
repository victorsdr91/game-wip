import { vec, Animation, CollisionType, Engine, Keys, Vector, GraphicsGroup, Font, Color, Text, TextAlign, CollisionGroupManager, EventEmitter } from "excalibur";
import { Config } from "../../state/Config";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { ActorStats } from "../ExtendedActor/contract";
import { PlayerProgressType } from "../../scenes/Level1/contract";
import { PlayerAnimation } from "./PlayerAnimations";
import { animationDirection, animationMode } from "./contract";
import { keyboardType } from "../../contract";


export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends ExtendedActor {
  public nickname: Text;
  private playerAnimation: PlayerAnimation;
  private direction: animationDirection = animationDirection.DOWN;
  private movementMode: animationMode = animationMode.IDLE;
  public isAttacking: boolean = false;
  private controlMap: Object = {};
  private attackMode: number = 0;
  private progress: PlayerProgressType;
  private playerDead: boolean = false;

  constructor(pos: Vector, nickname: string, progress: PlayerProgressType, stats: ActorStats, eventEmitter: EventEmitter) {
    super({
      pos: pos,
      width: 16,
      height: 16,
      collisionType: CollisionType.Active,
      collisionGroup: PlayerCollisionGroup,
      stats,
      eventEmitter,
    });
    this.nickname = new Text({ text: nickname, font: new Font({size: 8, color: Color.White, textAlign: TextAlign.Center})});
    this.progress = progress;
    this.playerAnimation = new PlayerAnimation(this.playerFrameSpeed);
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

  handleEvents() {
    this.handleNpcBasicAttack();
    this.handleMonsterRewards();
  }

  handleNpcBasicAttack() {
    this.event.on("npc-attack-basic", ({ pos, range, damage, actor}) => {
      let diff = this.pos.sub(pos);
      if (diff.distance() > range) {
        return;
      }
      
      this.receiveDamage(damage, actor);
    });
  }

  handleMonsterRewards() {
    this.event.on("npc-aggresive-died", ({ actor, rewards}) => {
      if(this.nickname.text === actor.nickname.text) {
        if(rewards.exp) {
          this.progress.exp += rewards.exp;
          console.log(`${this.nickname.text} has received ${rewards.exp} experience points`);
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

    this.event.emit('player-lvl-update', {newLvl: this.stats.level});
  }

  onInitialize() {
    this.playerAnimation.initialize();
    const attacks = this.playerAnimation.getAttackAnimations();

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
        this.event.emit('player-health-depleted', {callback: this.resetPlayer });
      }, 1500);
    })
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
    this.event.emit("player-attack-basic", eventData);
  }

  private move( direction: animationDirection, mode: animationMode) {
      this.movementMode = this.movementMode !== animationMode.RUN ? mode : this.movementMode;
      this.direction = direction;
      const isXMovement = this.direction === animationDirection.RIGHT || this.direction === animationDirection.LEFT;
      let x = 0;
      let y = 0;
      if(isXMovement) {
        x = direction === animationDirection.RIGHT ? this.playerSpeed : -this.playerSpeed;
      }
      else {
        y = direction === animationDirection.DOWN ? this.playerSpeed : -this.playerSpeed;
      }

      this.vel = vec(x, y);
  }

  private run(): void {
    this.playerSpeed = this.speed*this.stats.speed*2;
    this.movementMode = animationMode.RUN;
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.vel = Vector.Zero;
    this.playerSpeed = this.speed*this.stats.speed;
    this.movementMode = animationMode.IDLE;

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
    } else if(this.playerDead) {
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
          graphic: this.nickname,
          offset: new Vector(16, -4),
        },
        
      ]
    });
    
    graphicsGroup.width = 32;

    return graphicsGroup;
  }

  protected receiveDamage (damage: number, actor: ExtendedActor): void {
    const damageReceived = damage - this.stats.f_defense*this.stats.level;
    const totalDamage = damageReceived > 0 ? damageReceived : 0;
    this.updateHealth(this.getHealth() - totalDamage);
    
    if(this.getHealth() <= 0) {
      this.die();
    }
  }
  private updateHealth(health) {
    this.setHealth(health);
    this.event.emit('player-health-update', {health});
  }

  private die() {
    this.playerDead = true;
  }

  public resetPlayer = () => {
    this.pos = this.originalPosition;
    this.playerDead = false;
    this.direction = animationDirection.DOWN;
    this.updateHealth(this.getMaxHealth());
  }
}
