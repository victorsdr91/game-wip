import { Animation, CollisionType, Engine, Keys, Vector, GraphicsGroup, CollisionGroupManager } from "excalibur";
import { Config } from "../../state/config/Config";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { AnimationDirection, AnimationMode } from "../ExtendedActor/contract";
import { PlayerAnimation } from "./PlayerAnimations";
import { PlayerProgressType, PlayerProps } from "./contract";
import { Inventory } from "model/Inventory/Inventory";
import { PlayerEquipment } from "./PlayerEquipment";
import { WereableItem } from "model/Item/WereableItem";
import { KeyboardConfig, KeyboardConfigProps, KeyCallback } from "state/config/KeyboardConfig";
import { SlotType } from "./types/SlotType.enum";
import { ItemGroup } from "model/Item/ItemGroup";
import { ItemInterface } from "model/Item/interface/ItemInterface";
import PlayerEventsHandler from "services/EventsHandler/PlayerEventsHandler";
import { AttackType, DamageType, ElementType } from "model/ExtendedActor/types/AttackType.enum";

export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends ExtendedActor {
  private playerAnimation: PlayerAnimation;
  private keyboardConfig: KeyboardConfig;
  private attackMode: number = 0;
  private progress: PlayerProgressType;
  private inventory: Inventory;
  private deathMessageShown: boolean = false;
  private equipment: PlayerEquipment;
  private playerEventHandler: PlayerEventsHandler;

  constructor({pos, name, currentHealth, maxHealth, progress, stats, inventory, equipment, eventEmitter}: PlayerProps) {
    super({
      name,
      pos: pos,
      width: 16,
      height: 16,
      currentHealth,
      maxHealth,
      collisionType: CollisionType.Active,
      collisionGroup: PlayerCollisionGroup,
      stats,
      eventEmitter,
    });
    this.progress = progress;
    this.playerAnimation = new PlayerAnimation(this.frameSpeed);
    this.inventory = new Inventory(inventory);
    this.equipment = new PlayerEquipment({equipment});

    this.keyboardConfig = new KeyboardConfig(this.getKeyCallbackMap());
    this.playerEventHandler = new PlayerEventsHandler({player: this, eventEmitter});

  }

  private getKeyCallbackMap(): KeyboardConfigProps  {
    const keyCallbackMap: KeyboardConfigProps = {
      movement: new Map<string, KeyCallback>(),
      skills: new Map<string, KeyCallback>(),
      shortcuts: new Map<string, KeyCallback>()
    };

    keyCallbackMap.movement.set("left", () => { this.move(AnimationDirection.LEFT, AnimationMode.WALK)});
    keyCallbackMap.movement.set("right", () => { this.move(AnimationDirection.RIGHT, AnimationMode.WALK)});
    keyCallbackMap.movement.set("up", () => { this.move(AnimationDirection.UP, AnimationMode.WALK)});
    keyCallbackMap.movement.set("down", () => { this.move(AnimationDirection.DOWN, AnimationMode.WALK)});
    keyCallbackMap.movement.set("run", () => { this.run() });

    keyCallbackMap.skills.set("first", () => { this.isAttacking = true; });

    keyCallbackMap.shortcuts.set("bag", () => { this.playerEventHandler.toggleInventory() });
    keyCallbackMap.shortcuts.set("player", () => { this.playerEventHandler.toggleProfile() });

    return keyCallbackMap;
  }

  onInitialize() {
    this.playerEventHandler.initialize();
    this.playerAnimation.initialize();
    const attacks = this.playerAnimation.getAttackAnimations();
    console.log("Player inventory loaded: \n", this.inventory);
    this.loadEquipmentStats();
    console.log("Player equipment loaded: \n", this.equipment.equipment);

    Object.values(attacks).forEach((attackDirection) => {
      attackDirection.forEach((attack) => {
        attack.events.on("loop", () => {
          this.isAttacking = false;
          this.playerBasicAttack();
        });
      });
    });
  }

  loadEquipmentStats() {
    const equipment = this.equipment.equipment;

    for(const [key, value] of Object.entries(equipment)) {
      const item = value.getItem();
      this.addEquipmentStats(item);
    }
  }

  public swapEquipment(fromSlot: number, toSlot: SlotType, itemGroup: ItemGroup): void {
    this.inventory.removeItem(fromSlot);
    
    const currentEquipped = this.equipment.getEquipment(toSlot);
    if (currentEquipped) {
        this.inventory.addItemToFirstEmptySlot(currentEquipped);
    }
    
    this.equipment.setEquipment(toSlot, itemGroup);
    this.addEquipmentStats(itemGroup.getItem());
    
    this.playerEventHandler.updatePlayerInfoHud();
  }

  

  public addEquipmentStats(item: ItemInterface): void {
    if(item instanceof WereableItem && item.getStats() && item.getSlot() !== SlotType.BULLET) {
      const itemStats = item.getStats();
      if(itemStats) {
        Object.keys(itemStats).forEach((statKey) => {
          if(this.stats[statKey]) {
            this.stats[statKey] += itemStats[statKey];
          }
        });
      }
    }
  }

  public removeEquipmentStats(itemGroup: ItemGroup): void {
    const item = itemGroup.getItem();
    if(item instanceof WereableItem && item.getStats() && item.getSlot() !== SlotType.BULLET) {
      const itemStats = item.getStats();
      if(itemStats) {
        Object.keys(itemStats).forEach((statKey) => {
          if(this.stats[statKey]) {
            this.stats[statKey] -= itemStats[statKey];
          }
        });
      }
    }
  }

  public isLvlUp(exp: number): boolean {
    return exp >= this.progress.expNextLevel;
  }
  
  public lvlUp() {
    this.stats.level++;
    const diffExp = this.progress.exp - this.progress.expNextLevel;
    this.progress.exp = diffExp;
    this.progress.expNextLevel += (this.progress.expNextLevel*1.5)+50;

    this.playerEventHandler.updateStatsOnHud(this.stats);
  }

  private playerBasicAttack() {
    if(++this.attackMode > 2) {
      this.attackMode = 0;
    }
    this.playerEventHandler.handleAttackEvent({
      range: 20, 
      damage: this.calculatePhysicalDamage(),
      type: AttackType.PHYSICAL,
      element: ElementType.NORMAL,
      damageType: DamageType.SINGLE
    });
  }

  private calculatePhysicalDamage(): number {
    if(this.target) {
      const targetStats = this.target.getStats();
      const levelDifference = this.stats.level - targetStats.level;
      
      if(levelDifference < 0) {
        return (this.stats.f_attack * this.stats.f_damage * 0.5) + (1.5*this.stats.level) - (levelDifference * 2);
      } else if(levelDifference > 0) {
        return (this.stats.f_attack * this.stats.f_damage * 0.5) + (1.5*this.stats.level) + (levelDifference * 2);
      }
    }

    return (this.stats.f_attack * this.stats.f_damage * 0.5) + (1.5*this.stats.level);
  }

  private run(): void {
    this.isRunning = true;
    this.movementMode = AnimationMode.RUN;
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.vel = Vector.Zero;
    this.movementSpeed = this.isRunning ? this.originalSpeed * 2 : this.originalSpeed;
    this.movementMode = AnimationMode.IDLE;

    const runKey = Config.getControls().keyboard.movement.run as Keys;

    if(this.isRunning && !engine.input.keyboard.isHeld(runKey)) {
      this.isRunning = false;
      this.movementMode = AnimationMode.WALK;
    }

    this.keyboardConfig.bindKeys(engine);
    let animationGraphic = this.playerGraphic(this.playerAnimation.usePlayerAnimation({ mode: this.movementMode, direction: this.direction}));
    
    if(this.isAttacking) {
      animationGraphic = this.playerGraphic(this.playerAnimation.useAttackAnimation(this.direction, this.attackMode || 0));
    } else if(this.isDead) {
      animationGraphic = this.playerGraphic(this.playerAnimation.useDieAnimation());
    }

    this.graphics.use(animationGraphic);
  }

  onPostUpdate(engine: Engine, elapsed: number): void {
    if(this.isDead && !this.deathMessageShown) {
      this.playerEventHandler.sendPlayerDead(this.resetPlayer);
      this.deathMessageShown = true;
    }
  }

  protected playerGraphic(animation: Animation): GraphicsGroup {
    const graphicsGroup = new GraphicsGroup({
      useAnchor: true,
      members: [
        {
          graphic: animation,
          offset: new Vector(0, 8),
        },
        {
          graphic: this.nameTextGraphic,
          offset: new Vector(16, -4),
        },
        
      ]
    });
    
    graphicsGroup.width = 32;
    return graphicsGroup;
  }

  public updateHealth(health: number): void {
    this.setHealth(health);
    this.playerEventHandler.updateHealthOnHud(this.getHealth());
  }

  public resetPlayer = () => {
    this.pos = this.originalPosition;
    this.isDead = false;
    this.direction = AnimationDirection.DOWN;
    this.deathMessageShown = false;
    this.updateHealth(this.getMaxHealth());
  }

  public getEquipment(): PlayerEquipment {
    return this.equipment;
  }

  public getProgress(): PlayerProgressType {
    return this.progress;
  }

  public getInventory(): Inventory {
    return this.inventory;
  }

  public updateExp(receivedExp: number): void {
      this.progress.exp += receivedExp;
      this.isLvlUp(this.progress.exp) && this.lvlUp();
  }
}
