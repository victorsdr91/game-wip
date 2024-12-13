import { CollisionType, GraphicsGroup, range, SpriteSheet, Vector, Animation, Engine, Scene } from "excalibur";
import { AgressiveNpc } from "./AgressiveNpc";

export class Slime extends AgressiveNpc {


    constructor({ npcName, pos, sprite, spriteSize, stats}) {
        super({
          npcName,
          pos,
          sprite,
          spriteSize,
          stats,
          collisionType: CollisionType.Fixed
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
        die: Animation.fromSpriteSheet(spriteSheet, range(16, 23), 210),
      };
      this.z = 99;

      this.graphics.add("idle-down", this.animations.idle.down);
      this.animations.die && this.graphics.add("die", this.animations.die);
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
    }

    onPreUpdate(engine: Engine, elapsedMs: number): void {
      if(this.isAttacking()) {
        this.graphics.use("attack-down");
      }
    }

    onPreKill(scene: Scene): void {
      this.animateKill();
    }

    animateKill() {
      this.graphics.use("die");
    }
}