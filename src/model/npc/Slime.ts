import { CollisionType, GraphicsGroup, range, SpriteSheet, Vector, Animation, Engine, ActionContext, AnimationStrategy } from "excalibur";
import { AgressiveNpc } from "./AgressiveNpc";

export class Slime extends AgressiveNpc {

    constructor({ npcName, pos, sprite, spriteSize, stats, rewards, eventEmitter}) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          stats,
          rewards,
          collisionType: CollisionType.Active,
          eventEmitter
        });
    }

    onInitialize() {

      let animationMode = "idle";
      if(this.isAttacking()) {
        animationMode = "attack";
      }
      const spriteSheet = SpriteSheet.fromImageSource({
        image: this.sprite,
        grid: {
            rows: 3,
            columns: 8,
            spriteWidth: 40,
            spriteHeight: 36,
        },
        spacing: {
          originOffset: {
            x: 12, y: 8
          },
          margin: { x: 25, y: 32}
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
        this.event.emit("npc-aggresive-died", { rewards: this.rewards, actor: this.target});
        this.actions.clearActions();
        setTimeout(() => { this.kill(); }, 1000*60*3);
      });
      (this.animations.attack?.down as Animation).events.on("loop", () => { this.handleAttack() })
      this.animations.attack && this.graphics.add("attack-down", this.animations.attack.down);

      const graphicsGroup = new GraphicsGroup({
        useAnchor: true,
        members: [
          {
            graphic: this.animations[animationMode].down,
            offset: new Vector(4, -4),
          },
          {
            graphic: this.npcName,
            offset: new Vector(24, -2),
          },
          
        ]
      });
      graphicsGroup.width = 32;
      this.graphics.use(graphicsGroup);
      
      this.handleEvents();
    }

    handleEvents() {
      this.handlePlayerAttackEvent();
    }

    handlePlayerAttackEvent() {
      this.event.on("player-attack-basic", ({ pos, range, direction, damage, actor}) => {
        let diff = this.pos.sub(pos);
        if (diff.distance() > range) {
          return;
        }
        const attackFromRight = pos.x < this.pos.x && direction === "right";
        const attackFromLeft = pos.x > this.pos.x && direction === "left";
        const attackFromTop = pos.y > this.pos.y && direction === "up";
        const attackFromBottom = pos.y < this.pos.y && direction === "down";
  
        if (attackFromRight || attackFromLeft || attackFromBottom || attackFromTop) {
          this.receiveDamage(damage, actor);
        }
      });
    }

    handleAttack() {
      const eventData = {
        actor: this,
        pos: this.pos,
        damage: this.stats.f_attack*this.stats.level,
      }
      this.event.emit("npc-attack-basic", eventData);
      this.attacking = false;
    }

    onPreUpdate(engine: Engine, elapsedMs: number): void {
      if(this.getHealth() > 0) {
        if(this.isTaunted()) {
          const distanceFromTarget = this.pos.distance(this.target.pos);
          this.actions.clearActions();
          
          if(distanceFromTarget <= 20 && !this.isAttacking()) {
            this.attacking = true;
            this.graphics.use("attack-down");
          } else if(distanceFromTarget > 20 && distanceFromTarget < 80) {
            this.actions.meet(this.target, this.speed*this.stats.speed);
          } else if(distanceFromTarget > 80) {
            this.taunted=false;
            this.returnToOriginalPosition();
          }
        } else {
          this.graphics.use("idle-down");
        }
      } else {
        this.graphics.use("die");
      }
    }
}