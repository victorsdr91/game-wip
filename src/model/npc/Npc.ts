import { Color, Font, GraphicsGroup, ImageSource, Sprite, SpriteSheet, Text, TextAlign, Vector, Animation} from "excalibur";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { spriteSize } from "../../Scenes/Level1/contract";
import { ActorStats } from "../ExtendedActor/contract";

export interface npcAnimations {
  
  idle: { 
    up: Sprite | Animation,
    down: Sprite | Animation,
    left: Sprite | Animation,
    right: Sprite | Animation
  };
  attack?: {
    up: Sprite | Animation,
    down: Sprite | Animation,
    left: Sprite | Animation,
    right: Sprite | Animation
  }
  die?: Sprite | Animation,
}

export abstract class Npc extends ExtendedActor {
    public npcName: Text;
    protected sprite: ImageSource;
    protected spriteSize: { width: spriteSize, height: spriteSize };
    protected animations: npcAnimations;
    constructor({ npcName, pos, sprite, spriteSize, collisionType, collisionGroup, stats }) {
      super({
        pos: new Vector(pos.x, pos.y),
        width: spriteSize.width,
        height: spriteSize.height,
        collisionType,
        collisionGroup,
        stats,
      });

      this.z = pos.z;
      this.npcName = new Text({ text: `lvl ${stats.level} ${npcName}`, font: new Font({size: 8, color: Color.White, textAlign: TextAlign.Center})});
      this.sprite = sprite;
      this.spriteSize = spriteSize;
  
    }
  
    onInitialize() {
      const spriteSheet = SpriteSheet.fromImageSource({
        image: this.sprite,
        grid: {
            rows: 4,
            columns: 3,
            spriteWidth: this.spriteSize.width,
            spriteHeight: this.spriteSize.height,
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

      const graphicsGroup = new GraphicsGroup({
        useAnchor: true,
        members: [
          {
            graphic: this.animations.idle.down,
            offset: new Vector(10, 5),
          },
          {
            graphic: this.npcName,
            offset: new Vector(32, -4),
          },
          
        ]
      });
      graphicsGroup.width = 32;
      this.graphics.use(graphicsGroup);
      
    }
}