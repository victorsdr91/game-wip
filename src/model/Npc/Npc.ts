import { Color, Font, GraphicsGroup, ImageSource, Sprite, SpriteSheet, Text, TextAlign, Vector, Animation, range, AnimationStrategy, Graphic, Engine, CollisionGroupManager, CollisionGroup} from "excalibur";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { spriteSize } from "../../scenes/Test/contract";
import { NpcProps, NpcType } from "./contract";
import { Resources } from "../../scenes/Test/resources";
import { EventMap } from "model/EventManager/contract";
import { TauntComponent } from "services/systems/Combat/components/TauntComponent";
import { Skill } from "services/systems/Combat/types/skill.type";
import { CombatComponent } from "services/systems/Combat/components/CombatComponent";

export const AlliesGroup = CollisionGroupManager.create('allies');
export const EnemiesGroup = CollisionGroupManager.create('enemies');

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

export class Npc extends ExtendedActor {
    protected sprite: ImageSource;
    protected spriteSize: { width: spriteSize, height: spriteSize };
    protected animations: npcAnimations | undefined;
    protected _eventMap: EventMap;
    private skills: Skill[] = [];
    private _type: NpcType;

    hpGraphic: Text;

    constructor({ name, pos, sprite, type, spriteSize, collisionType,stats, currentHealth, maxHealth, events, skills }: NpcProps) {
      super({
        name,
        pos: new Vector(pos.x, pos.y),
        width: spriteSize.width,
        height: spriteSize.height,
        collisionType,
        collisionGroup: type === NpcType.ENEMY ? EnemiesGroup : AlliesGroup,
        stats,
        currentHealth,
        maxHealth,
      });
      this.z = pos.z || 9;
      this.hpGraphic = new Text({ text: `${this.getHealth()}`, font: new Font({size: 8, color: Color.Green, textAlign: TextAlign.Center})});
      this.sprite = Resources[sprite];
      this.spriteSize = spriteSize;
      this._eventMap = events || [];
      this._type = type;
      this.skills = skills || [];
    }
  
    onInitialize() {
      this.addNpcComponents();
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

      this.graphics.add("idle-down", this.animations.idle.down);

      this.useGraphic(this.animations.idle.down);
    }

    onPreUpdate(engine: Engine, elapsed: number): void {
      if(this.animations) {
        this.useGraphic(this.animations.idle.down);
        this.hpGraphic.text = `${this.getHealth()}`;
        if( this.getHealth() <= 0 && this.animations.die) {
          this.useGraphic(this.animations.die);
          this.hpGraphic.color = Color.Red;
        }
        
      }
    }

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

    hasDirectInteraction(playerPos: Vector, playerDirection): boolean {
        const fromRight = playerPos.x < this.pos.x && playerDirection === "right";
        const fromLeft = playerPos.x > this.pos.x && playerDirection === "left";
        const fromTop = playerPos.y > this.pos.y && playerDirection === "up";
        const fromBottom = playerPos.y < this.pos.y && playerDirection === "down";

        return fromBottom || fromLeft || fromTop || fromRight;
    }

    get type(): NpcType {
        return this._type;
    }
    get eventMap(): EventMap {
        return this._eventMap;
    }

    addNpcComponents(): void {
        switch (this._type) {
            case NpcType.ENEMY:
                const tauntComponent = new TauntComponent();
                const combatComponent = new CombatComponent(this.skills);
                this.addComponent(combatComponent);
                this.addComponent(tauntComponent);
                break;
            case NpcType.NEUTRAL:
                break;
            case NpcType.MERCHANT:
                break;
            case NpcType.ALLY:
            default:
                break;
        }
    }
}