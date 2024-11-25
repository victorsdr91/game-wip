import { Actor, CollisionType, Engine, ImageSource, Sprite, SpriteSheet, Vector } from "excalibur";

export class Npc extends Actor {
    private speed: number = 16; // pixels/sec
    private npcName: string;
    private multiplier: number;
    private playerSpeed: number;
    private playerFrameSpeed: 200; // ms
    private health: number = 100;
    private sprite: ImageSource;
    private direction: string = "down";
    private animations: {idle: { up: Sprite, down: Sprite, left: Sprite, right: Sprite}};
  
    constructor({ npcName, pos, health, sprite }) {
      super({
        pos: pos,
        width: 20,
        height: 30,
        collisionType: CollisionType.Active
      });

      this.npcName = npcName;
      this.health = health;
      this.sprite = sprite;
  
    }
  
    onInitialize() {
      const spriteSheet = SpriteSheet.fromImageSource({
        image: this.sprite,
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
          up: spriteSheet.getSprite(0,0),
          down: spriteSheet.getSprite(0,1),
          left: spriteSheet.getSprite(0,2),
          right: spriteSheet.getSprite(0,3)
        },
      };
      
    }

  public getHealth(): number{
    return this.health;
  }

  public setHealth( health: number) {
    this.health = health;
  }
}