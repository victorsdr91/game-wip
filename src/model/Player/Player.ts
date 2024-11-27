import { Actor, vec, SpriteSheet, Animation, range, CollisionType, Engine, Keys, Vector, Graphic, Sprite, GraphicsGroup, Font, Color, Text, TextAlign } from "excalibur";
import { Resources } from "../../resources";

type PlayerAnimations = {
  idle: {
    left: Sprite;
    up: Sprite;
    right: Sprite;
    down: Sprite;
  }
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
  private nickname: Text;
  private multiplier: number;
  private playerSpeed: number;
  private playerFrameSpeed: 200; // ms
  private health: number = 100;
  private spriteSheet: SpriteSheet;
  private animations: PlayerAnimations;
  private direction: string = "down";

  constructor(pos: Vector, nickname: string) {
    super({
      pos: pos,
      width: 20,
      height: 30,
      collisionType: CollisionType.Active
    });
    this.nickname = new Text({ text: nickname, font: new Font({size: 8, color: Color.White, textAlign: TextAlign.Center})});
  }

  onInitialize() {
    this.spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Player,
      grid: {
          rows: 23,
          columns: 11,
          spriteWidth: 32,
          spriteHeight: 32
      },
      spacing: {
          // Optionally specify the offset from the top left of sheet to start parsing
          originOffset: { x: 1, y: 1 },
          // Optionally specify the margin between each sprite
          margin: { x: 1, y: 1}
      }
    });
    this.animations = {
      idle: {
        up: this.spriteSheet.getSprite(0,0),
        down: this.spriteSheet.getSprite(0,1),
        left: this.spriteSheet.getSprite(0,2),
        right: this.spriteSheet.getSprite(0,3)
      },
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
    this.multiplier=3;
    this.playerSpeed = this.speed*this.multiplier;
    var walkMode = "idle";
    
    if (engine.input.keyboard.isHeld(Keys.ArrowRight)) {
      walkMode = this.walkMode(engine);
      this.direction = "right";
      this.vel = vec(this.playerSpeed, 0);
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowLeft)) {
      walkMode = this.walkMode(engine);
      this.direction = "left";
      this.vel = vec(-this.playerSpeed, 0);
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
      walkMode = this.walkMode(engine);
      this.direction = "up";
      this.vel = vec(0, -this.playerSpeed);
    }
    if (engine.input.keyboard.isHeld(Keys.ArrowDown)) {
      walkMode = this.walkMode(engine);
      this.direction = "down";
      this.vel = vec(0, this.playerSpeed);
    }


    const graphicsGroup = new GraphicsGroup({
      useAnchor: true,
      members: [
        {
          graphic: this.animations[walkMode][this.direction],
          offset: new Vector(0, 5),
        },
        {
          graphic: this.nickname,
          offset: new Vector(16, -8),
        },
        
      ]
    });
    graphicsGroup.width = 32;
    this.graphics.use(graphicsGroup);
      
}

  private walkMode(engine: Engine): string {
    if(engine.input.keyboard.isHeld(Keys.A)) {
      this.multiplier=6;
      this.playerSpeed = this.speed*this.multiplier;
      return "run";
    }
    return "walk";
  }

}
