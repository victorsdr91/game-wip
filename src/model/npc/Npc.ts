import { Color, Font, GraphicsGroup, ImageSource, Sprite, SpriteSheet, Text, TextAlign, Vector} from "excalibur";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";



export abstract class Npc extends ExtendedActor {
    private npcName: Text;
    private sprite: ImageSource;
    private spriteSize: spriteSize;
    private animations: {idle: { up: Sprite, down: Sprite, left: Sprite, right: Sprite}};
  
    constructor({ npcName, pos, sprite, spriteSize, collisionType, stats }) {
      super({
        pos: new Vector(pos.x, pos.y),
        width: 20,
        height: 30,
        collisionType,
        stats,
      });

      this.z = pos.z;
      this.npcName = new Text({ text: `lvl ${stats.level} ${npcName}`, font: new Font({size: 8, color: Color.White, textAlign: TextAlign.Center})});
      this.sprite = sprite;
      this.spriteSize = spriteSize
  
    }
  
    onInitialize() {
      const spriteSheet = SpriteSheet.fromImageSource({
        image: this.sprite,
        grid: {
            rows: 4,
            columns: 3,
            spriteWidth: this.spriteSize,
            spriteHeight: this.spriteSize,
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