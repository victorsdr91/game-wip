import { Actor, CollisionType, ImageSource, Sprite, SpriteSheet, Vector} from "excalibur";

export abstract class Npc extends Actor {
    private speed: number = 16; // pixels/sec
    private npcName: string;
    private multiplier: number;
    private playerSpeed: number;
    private playerFrameSpeed: 200; // ms
    private health: number = 100;
    private sprite: ImageSource;
    private animations: {idle: { up: Sprite, down: Sprite, left: Sprite, right: Sprite}};
  
    constructor({ npcName, pos, health, sprite }) {
      super({
        pos: new Vector(pos.x, pos.y),
        width: 20,
        height: 30,
        collisionType: CollisionType.Fixed
      });

      this.z = pos.z;

      this.npcName = npcName;
      this.health = health;
      this.sprite = sprite;
  
    }
  
    onInitialize() {
      const spriteSheet = SpriteSheet.fromImageSource({
        image: this.sprite,
        grid: {
            rows: 4,
            columns: 3,
            spriteWidth: 32,
            spriteHeight: 32
        },
      });
      this.animations = {
        idle: {
          up: spriteSheet.getSprite(0,0),
          down: spriteSheet.getSprite(0,1),
          left: spriteSheet.getSprite(0,2),
          right: spriteSheet.getSprite(0,3)
        },
      };
      this.z = 99;

      this.graphics.add("idle-down", this.animations.idle.down);
      this.graphics.use("idle-down");
      
    }

  public getHealth(): number{
    return this.health;
  }

  public setHealth( health: number) {
    this.health = health;
  }
}