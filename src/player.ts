import { Actor, vec, SpriteSheet, Animation, range, CollisionType, Engine, Keys, Vector } from "excalibur";
import { Resources } from "./resources";

type PlayerAnimations = {
  walk: {
    left: Animation;
    up: Animation;
    right: Animation;
    down: Animation;
  }
  run: {
    left: Animation;
    up: Animation;
    right: Animation;
    down: Animation;
  }
};

export class Player extends Actor {
  private speed: number = 16; // pixels/sec
  private multiplier: number = 2;
  private playerSpeed = this.speed*this.multiplier;
  private playerFrameSpeed: 200; // ms
  private health: number = 100;
  private spriteSheet: SpriteSheet;
  private animations: PlayerAnimations;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: 24,
      height: 31,
      collisionType: CollisionType.Active
    });

    
  }

  onInitialize() {
    this.spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Player,
      grid: {
          rows: 23,
          columns: 11,
          spriteWidth: 24,
          spriteHeight: 31
      },
      spacing: {
          // Optionally specify the offset from the top left of sheet to start parsing
          originOffset: { x: 3, y: 2 },
          // Optionally specify the margin between each sprite
          margin: { x: 10, y: 2}
      }
    });
    this.animations = {
      walk: {
        up: Animation.fromSpriteSheet(this.spriteSheet, range(0, 2), this.playerFrameSpeed),
        down: Animation.fromSpriteSheet(this.spriteSheet, range(11, 13), this.playerFrameSpeed),
        left: Animation.fromSpriteSheet(this.spriteSheet, range(22, 24), this.playerFrameSpeed),
        right: Animation.fromSpriteSheet(this.spriteSheet, range(33, 35), this.playerFrameSpeed)
      },
      run: {
        up: Animation.fromSpriteSheet(this.spriteSheet, range(4, 6), this.playerFrameSpeed),
        down: Animation.fromSpriteSheet(this.spriteSheet, range(15, 17), this.playerFrameSpeed),
        left: Animation.fromSpriteSheet(this.spriteSheet, range(26, 28), this.playerFrameSpeed),
        right: Animation.fromSpriteSheet(this.spriteSheet, range(37, 39), this.playerFrameSpeed)
      }
    };
    
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.vel = Vector.Zero;

    this.graphics.add(this.spriteSheet.getSprite(0,0));
    if (engine.input.keyboard.isHeld(Keys.ArrowRight)) {
        this.vel = vec(this.playerSpeed, 0);
        this.graphics.use(this.animations.walk.right);
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowLeft)) {
        this.vel = vec(-this.playerSpeed, 0);
        this.graphics.use(this.animations.walk.left);
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
        this.vel = vec(0, -this.playerSpeed);
        this.graphics.use(this.animations.walk.up);
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowDown)) {
        this.vel = vec(0, this.playerSpeed);
        this.graphics.use(this.animations.walk.down);
    }

}

  getSpeed() {
    return this.speed;
  }

  getHealth() {
    return this.health;
  }
}
