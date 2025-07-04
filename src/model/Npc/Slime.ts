import { GraphicsGroup, range, SpriteSheet, Vector, Animation, Engine, AnimationStrategy, Graphic, Debug, Color } from "excalibur";
import { AgressiveNpc } from "./AgressiveNpc";
import { AgressiveNpcType } from "./contract";
import { AnimationDirection, Attack } from "model/ExtendedActor/contract";
import { AttackType, DamageType, ElementType } from "model/ExtendedActor/types/AttackType.enum";

export class Slime extends AgressiveNpc {

    constructor({ name, pos, sprite, spriteSize, collisionType, stats, currentHealth, maxHealth, rewards, eventEmitter}: AgressiveNpcType) {
        super({
          name,
          pos,
          sprite,
          spriteSize,
          stats,
          currentHealth,
          maxHealth,
          rewards,
          collisionType,
          eventEmitter
        });
    }

    onInitialize() {
      const spriteSheet = SpriteSheet.fromImageSource({
        image: this.sprite,
        grid: {
            rows: 3,
            columns: 8,
            spriteWidth: 64,
            spriteHeight: 64,
        },
        spacing: {
          originOffset: {
            x: 0, y: 0
          },
          // Optionally specify the margin between each sprite
          margin: { x: 0, y: 0}
      }
      });
      this.animations = {
        idle: {
          up: spriteSheet.getSprite(0,0),
          down: Animation.fromSpriteSheet(spriteSheet, range(0, 3), 210),
          left: spriteSheet.getSprite(0,2),
          right: spriteSheet.getSprite(0,1)
        },
        attack: {
          up: spriteSheet.getSprite(0,0),
          down: Animation.fromSpriteSheet(spriteSheet, range(8, 15), 210),
          left: spriteSheet.getSprite(0,2),
          right: spriteSheet.getSprite(0,1)
        },
        die: Animation.fromSpriteSheet(spriteSheet, range(16, 23), 210, AnimationStrategy.Freeze),
      };
      this.z = 99;

      this.graphics.add("idle-down", this.animations.idle.down);
      this.animations.die && this.graphics.add("die", this.animations.die);
      (this.animations.die as Animation).events.on("end", () => { 
        this.eventEmitter.emit("npc-aggresive-died", { npc: this, rewards: this.rewards, actor: this.target});
        this.actions.clearActions();
        setTimeout(() => { this.kill(); }, 1000*10);
      });
      (this.animations.attack?.down as Animation).events.on("loop", () => { this.handleAttack() })
      this.animations.attack && this.graphics.add("attack-down", this.animations.attack.down);
      
      this.handleEvents();
    }

    //TODO: Standarize for any kind of mob
    useGraphic(graphic: Graphic) {
      const graphicsGroup = new GraphicsGroup({
        useAnchor: false,
        members: [
          {
            graphic: graphic,
            offset: new Vector(-32, -32),
          },
          {
            graphic: this.nameTextGraphic,
            offset: new Vector(0, -20),
          },
          {
            graphic: this.hpGraphic,
            offset: new Vector(0, -27),
          },
          
        ]
      });
      graphicsGroup.width = 32;

      this.graphics.use(graphicsGroup);
    }

    handleEvents() {
      this.handlePlayerAttackEvent();
    }

    handlePlayerAttackEvent() {
      this.eventEmitter.on("player-attack", ({ pos, range, direction, damage, from}: Attack) => {
        let diff = this.pos.sub(pos);
        if (diff.distance() > range) {
          return;
        }
  
        if (this.hasDirectInteraction(pos, direction)) {
          this.receiveDamageFromPlayer(damage, from);
        }
      });
    }

    handleAttack() {
      const eventData: Attack = {
        from: this,
        pos: this.pos,
        damage: this.calculateDamage(),
        direction: AnimationDirection.UP,
        damageType: DamageType.SINGLE,
        type: AttackType.PHYSICAL,
        element: ElementType.NORMAL,
        range: 20
      };
      if(this.isAttacking) {
        Debug.drawCircle(this.pos, eventData.range, {
            color: Color.Transparent,
            strokeColor: Color.Green,
            width: 0.5
        });
      }
      this.eventEmitter.emit("npc-attack", eventData);
      this.attacking = false;
    }

    protected calculateDamage(): number {
      if(this.target) {
        const targetStats = this.target.getStats();
        const levelDifference = this.stats.level - targetStats.level;
        
        if(levelDifference < 0) {
          return (this.stats.f_attack * this.stats.f_damage) + (1.5*this.stats.level) - (levelDifference * 2);
        } else if(levelDifference > 0) {
          return (this.stats.f_attack * this.stats.f_damage) + (1.5*this.stats.level) + (levelDifference * 2);
        }
      }

      return (this.stats.f_attack * this.stats.f_damage) + (1.5*this.stats.level);
    }

    onPreUpdate(engine: Engine, elapsedMs: number): void {
      if(this.getHealth() > 0) {
        this.useGraphic(this.graphics.use("idle-down"));
        this.attacking = false;

        if(this.isTaunted()) {
          const distanceFromTarget = this.pos.distance(this.target?.pos);
          this.actions.clearActions();

          if(distanceFromTarget <= 20 && !this.isAttacking) {
            this.attacking = true;
            this.useGraphic(this.graphics.use("attack-down"));
          } else if(distanceFromTarget > 20 && distanceFromTarget < 80 && this.target) {
            this.actions.meet(this.target, this.speed*this.stats.speed);
          } else if(distanceFromTarget > 80) {
            this.taunted=false;
            this.returnToOriginalPosition();
            this.passiveHeal();
          }
        }
      } else {
        this.useGraphic(this.graphics.use("die"));
      }
    }
}