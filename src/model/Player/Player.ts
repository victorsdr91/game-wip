import { vec, SpriteSheet, Animation, range, CollisionType, Engine, Keys, Vector, Sprite, GraphicsGroup, Font, Color, Text, TextAlign, Actor, GameEvent, EventEmitter, CollisionGroupManager, Side, PreCollisionEvent, CollisionStartEvent, PostCollisionEvent, CollisionEndEvent } from "excalibur";
import { Resources } from "../../resources";
import { Config } from "../../state/Config";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { ActorStats } from "../ExtendedActor/contract";
import { ActorEvents } from "excalibur/build/dist/Actor";
import { AgressiveNpc } from "../npc/AgressiveNpc";

type PlayerAnimations = {
  idle: SpriteObject;
  walk: AnimationObject;
  run: AnimationObject;
  attack: AnimationObject[]
};

interface AnimationObject {
  up: Animation;
  down: Animation;  
  left: Animation;
  right: Animation;
}

interface SpriteObject {
  up: Sprite;
  down: Sprite;  
  left: Sprite;
  right: Sprite;
}

type PlayerEvents = {
  playerAttack: PlayerAttackEvent;
}

export class PlayerAttackEvent extends GameEvent<Player> {
  constructor(public target: Player) {
    super();
  }
}

export const PlayerEvents = {
  playerAttack: 'playerAttack'
} as const;

export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends ExtendedActor {
  public events = new EventEmitter<ActorEvents & PlayerEvents>();
  private nickname: Text;
  private spriteSheet: SpriteSheet;
  private animations: PlayerAnimations;
  private direction: string = "down";
  public isAttacking: boolean = false;
  private hasAttacked: boolean = false;
  private attackMode: number = 0;
  private attackCollisionActors: AgressiveNpc[];

  constructor(pos: Vector, nickname: string, stats: ActorStats) {
    super({
      pos: pos,
      width: 16,
      height: 22,
      collisionType: CollisionType.Passive,
      collisionGroup: PlayerCollisionGroup,
      stats: stats,
    });
    this.nickname = new Text({ text: `lvl ${stats.level} ${nickname}`, font: new Font({size: 8, color: Color.White, textAlign: TextAlign.Center})});
    this.attackCollisionActors = new Array<AgressiveNpc>();

    this.on("collisionstart", (evt) => { this.handlePlayerCollision(evt) });
    this.on("collisionend",(evt) => { this.resolveColission(evt) });
  }

  onInitialize() {
    this.spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Player,
      grid: {
          rows: 25,
          columns: 8,
          spriteWidth: 32,
          spriteHeight: 32
      },
      spacing: {
          originOffset: {
            x: 0, y: 0
          },
          // Optionally specify the margin between each sprite
          margin: { x: 0, y: 0}
      }
    });
    let initialRange = 0;
    
    this.animations = {
      idle: {
        up: this.spriteSheet.getSprite(0,2),
        down: this.spriteSheet.getSprite(0,0),
        left: this.spriteSheet.getSprite(0,1).clone(),
        right: this.spriteSheet.getSprite(0,1),
      },
      walk: {
        down: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange, initialRange + 5), this.playerFrameSpeed),
        left: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed).clone(),
        right: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange, initialRange + 5), this.playerFrameSpeed),
        up: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange+=8, initialRange + 3), this.playerFrameSpeed),
      },
      run: {
        down: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed),
        left: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed).clone(),
        right: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange, initialRange + 5), this.playerFrameSpeed),
        up: Animation.fromSpriteSheet(this.spriteSheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed),
      },
      attack: [
        {
          down: Animation.fromSpriteSheet(this.spriteSheet, range(48, 51), this.playerFrameSpeed),
          left: Animation.fromSpriteSheet(this.spriteSheet, range(72, 75), this.playerFrameSpeed).clone(),
          right: Animation.fromSpriteSheet(this.spriteSheet, range(72, 75), this.playerFrameSpeed),
          up: Animation.fromSpriteSheet(this.spriteSheet, range(96, 99), this.playerFrameSpeed),
        },
        {
          down: Animation.fromSpriteSheet(this.spriteSheet, range(56, 59), this.playerFrameSpeed),
          left: Animation.fromSpriteSheet(this.spriteSheet, range(80, 83), this.playerFrameSpeed).clone(),
          right: Animation.fromSpriteSheet(this.spriteSheet, range(80, 83), this.playerFrameSpeed),
          up: Animation.fromSpriteSheet(this.spriteSheet, range(104, 107), this.playerFrameSpeed),
        },
        {
          down: Animation.fromSpriteSheet(this.spriteSheet, range(64, 67), this.playerFrameSpeed),
          left: Animation.fromSpriteSheet(this.spriteSheet, range(88, 91), this.playerFrameSpeed).clone(),
          right: Animation.fromSpriteSheet(this.spriteSheet, range(88, 91), this.playerFrameSpeed),
          up: Animation.fromSpriteSheet(this.spriteSheet, range(112, 115), this.playerFrameSpeed),
        },
      ]
    };
    

    
    this.animations.idle.left.flipHorizontal = true;
    this.animations.walk.left.flipHorizontal = true;
    this.animations.run.left.flipHorizontal = true;

    this.animations.attack.forEach((attack) => {

      attack.left.flipHorizontal = true;
    });
  }

  public calculateDamage(attacker: ExtendedActor, defender: ExtendedActor): number {
    const attackerStats = attacker.getStats();
    const defenderStats = defender.getStats();
    const damageDealt = (attackerStats.f_attack*attackerStats.level - defenderStats.f_defense*defenderStats.level);
    return damageDealt > 0 ? damageDealt : 0;
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.vel = Vector.Zero;
    this.playerSpeed = this.speed*this.stats.speed;
    let isWalking = false;
    let isRunning = false;
    const movementConfig = Config.getControls().keyboard.movement;
    const collidingSide = {
      right: this.colliding && this.collisionSide === Side.Right,
      top: this.colliding && this.collisionSide === Side.Top,
      left: this.colliding && this.collisionSide === Side.Left,
      bottom: this.colliding && this.collisionSide === Side.Bottom,
    };
    

    if(engine.input.keyboard.isHeld(Keys.Key1)) {
      this.isAttacking = true;
    }
    isRunning = this.isRunning(engine, movementConfig);
    if (engine.input.keyboard.isHeld(Keys[movementConfig.right]) && !collidingSide.right ) {
      isWalking = true;
      this.direction = "right";
      this.vel = vec(this.playerSpeed, 0);
    }
    if (engine.input.keyboard.isHeld(Keys[movementConfig.left]) && !collidingSide.left ) {
      isWalking = true;
      this.direction = "left";
      this.vel = vec(-this.playerSpeed, 0);
    }
    if (engine.input.keyboard.isHeld(Keys[movementConfig.up]) && !collidingSide.top ) {
      isWalking = true;
      this.direction = "up";
      this.vel = vec(0, -this.playerSpeed);
    }
    if (engine.input.keyboard.isHeld(Keys[movementConfig.down]) && !collidingSide.bottom ) {
      isWalking = true;
      this.direction = "down";
      this.vel = vec(0, this.playerSpeed);
    }
   const walkMode = isWalking ? (isRunning ? "run" : "walk") : "idle";
    

    this.animations.attack[this.attackMode][this.direction].events.on('loop', () => {
      this.isAttacking = false;
      this.hasAttacked = true;
      this.attackMode++;
      if(this.attackMode > 2) {
        this.attackMode = 0;
      }
    });
    
    const graphicsGroup = new GraphicsGroup({
      useAnchor: true,
      members: [
        {
          graphic: this.isAttacking ? this.animations.attack[this.attackMode][this.direction] : this.animations[walkMode][this.direction],
          offset: new Vector(0, 8),
        },
        {
          graphic: this.nickname,
          offset: new Vector(16, -4),
        },
        
      ]
    });
    
    graphicsGroup.width = 32;
    this.graphics.use(graphicsGroup);
  }

  onPostUpdate(engine: Engine, delta: number): void {
    if(this.hasAttacked) {
        this.attackCollisionActors.forEach((defender: AgressiveNpc) => {
          const damageDealt = this.calculateDamage(this, defender);
          defender.actions.blink(200, 200, 3);
          defender.setHealth(defender.getHealth() - damageDealt);
          console.log(`${this.nickname.text} ha hecho ${damageDealt} puntos de daño a ${defender.npcName.text}`);
          if(!defender.isAttacking()) {
            defender.toggleAttacking();
          };
        });
      this.hasAttacked = false;
    }
  }

  private isRunning(engine: Engine, movementConfig): boolean {
    if(engine.input.keyboard.isHeld(movementConfig.run)) {
      this.playerSpeed = this.speed*this.stats.speed*2;
      return true;
    }
    return false;
  }

  public addEnemyAttacked(npc: AgressiveNpc){
    if(!this.attackCollisionActors.includes(npc)) {
      this.attackCollisionActors.push(npc);
    }
  }

  public removeEnemyAttacked(npc: AgressiveNpc){
    const npcIndex = this.attackCollisionActors.indexOf(npc);
    if( npcIndex > -1 ) {
      this.attackCollisionActors.splice(npcIndex, 1);
    }

   
  }

  private handlePlayerCollision(ev: CollisionStartEvent) {
      if(ev.other instanceof AgressiveNpc) {
          console.log("Colision con "+ev.other.npcName.text);
          this.addEnemyAttacked(ev.other);
          
      };
      this.collisionSide = ev.side;
      this.colliding = true;
  }

  private resolveColission(ev: CollisionEndEvent) {
    if(ev.other instanceof AgressiveNpc) {
      this.removeEnemyAttacked(ev.other);
      console.log("Fin de colision con "+ev.other.npcName.text);
    }
    this.colliding = false;
}
}
