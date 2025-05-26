import { Color, Font, GraphicsGroup, ImageSource, Sprite, SpriteSheet, Text, TextAlign, Vector, Animation} from "excalibur";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { spriteSize } from "../../scenes/Level1/contract";
import { NpcType } from "./contract";
import { Resources } from "../../scenes/Level1/resources";

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
    protected sprite: ImageSource;
    protected spriteSize: { width: spriteSize, height: spriteSize };
    protected animations: npcAnimations | undefined;
    public hpGraphic: Text;
    constructor({ name, pos, sprite, spriteSize, collisionType, collisionGroup, stats, currentHealth, maxHealth, eventEmitter }: NpcType) {
      super({
        name,
        pos: new Vector(pos.x, pos.y),
        width: spriteSize.width,
        height: spriteSize.height,
        collisionType,
        collisionGroup,
        stats,
        currentHealth,
        maxHealth,
        eventEmitter
      });

      this.z = pos.z || 9;
      this.hpGraphic = new Text({ text: `${this.getHealth()}`, font: new Font({size: 8, color: Color.Green, textAlign: TextAlign.Center})});
      this.sprite = Resources[sprite];
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
            graphic: this.nameTextGraphic,
            offset: new Vector(32, -4),
          },
          
        ]
      });
      graphicsGroup.width = 32;
      this.graphics.use(graphicsGroup);
    }
}