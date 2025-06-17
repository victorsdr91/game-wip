import { Animation, CollisionType, Engine, Keys, Vector, GraphicsGroup, CollisionGroupManager } from "excalibur";
import { Config } from "../../state/config/Config";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { animationDirection, animationMode } from "../ExtendedActor/contract";
import { PlayerAnimation } from "./PlayerAnimations";
import { PlayerProgressType, PlayerProps } from "./contract";
import { Inventory } from "model/Inventory/Inventory";
import { Game } from "services/Game";
import { EquipItemPayload, HudPlayerEvents, UnequipItemPayload } from "state/helpers/PlayerEvents";
import { PlayerEquipment } from "./PlayerEquipment";
import { WereableItem } from "model/Item/WereableItem";
import { KeyboardConfig, KeyboardConfigProps, KeyCallback } from "state/config/KeyboardConfig";
import { SlotType } from "./types/SlotType.enum";
import { SlotValidator } from "model/Item/SlotValidator";
import { ItemGroup } from "model/Item/ItemGroup";
import { ItemInterface } from "model/Item/interface/ItemInterface";


export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends ExtendedActor {
  private playerAnimation: PlayerAnimation;
  private keyboardConfig: KeyboardConfig;
  private attackMode: number = 0;
  private progress: PlayerProgressType;
  private inventory: Inventory;
  private deathMessageShown: boolean = false;
  private equipment: PlayerEquipment;
  private game: Game;

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
    this.game = Game.getInstance();

    this.keyboardConfig = new KeyboardConfig(this.getKeyCallbackMap());
    this.handleEvents();

  }

  private getKeyCallbackMap(): KeyboardConfigProps  {
    const keyCallbackMap: KeyboardConfigProps = {
      movement: new Map<string, KeyCallback>(),
      skills: new Map<string, KeyCallback>(),
      shortcuts: new Map<string, KeyCallback>()
    };

    keyCallbackMap.movement.set("left", () => { this.move(animationDirection.LEFT, animationMode.WALK)});
    keyCallbackMap.movement.set("right", () => { this.move(animationDirection.RIGHT, animationMode.WALK)});
    keyCallbackMap.movement.set("up", () => { this.move(animationDirection.UP, animationMode.WALK)});
    keyCallbackMap.movement.set("down", () => { this.move(animationDirection.DOWN, animationMode.WALK)});
    keyCallbackMap.movement.set("run", () => { this.run() });

    keyCallbackMap.skills.set("first", () => { this.isAttacking = true; });

    keyCallbackMap.shortcuts.set("bag", () => { this.toggleHUD(HudPlayerEvents.HUD_PLAYER_TOGGLE_INVENTORY)});
    keyCallbackMap.shortcuts.set("player", () => { this.toggleHUD(HudPlayerEvents.HUD_PLAYER_TOGGLE_PROFILE)});

    return keyCallbackMap;
  }

  toggleHUD(event: HudPlayerEvents) {
      Game.getInstance().emit(event, {});
  }

  onInitialize() {
    this.playerAnimation.initialize();
    const attacks = this.playerAnimation.getAttackAnimations();
    console.log("Player inventory loaded: \n", this.inventory);
    this.loadEquipmentStats();
    this.updatePlayerInfoHud(this);
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

  handleEvents() {
    this.handleNpcBasicAttack();
    this.handleMonsterRewards();
    this.handleEquipItem();
    this.handleRemoveEquipment();    
  }

  private swapEquipment(fromSlot: number, toSlot: SlotType, itemGroup: ItemGroup): void {
    this.inventory.removeItem(fromSlot);
    
    const currentEquipped = this.equipment.getEquipment(toSlot);
    if (currentEquipped) {
        this.inventory.addItemToFirstEmptySlot(currentEquipped);
    }
    
    this.equipment.setEquipment(toSlot, itemGroup);
    this.addEquipmentStats(itemGroup.getItem());
    
    this.inventory.emitInventoryUpdate();
    this.updatePlayerInfoHud(this);
  }

  handleEquipItem() {
    this.game.on(HudPlayerEvents.HUD_PLAYER_EQUIP_ITEM, (event: unknown) => {
        const { fromSlot, toSlot, itemGroup } = event as EquipItemPayload;
        
        if (!(itemGroup.getItem() instanceof WereableItem)) return;
            const item = itemGroup.getItem() as WereableItem;
            // Verificar si el slot es válido
            if (!SlotValidator.isValidSlot(item.getSlot(), toSlot)) {
                return;
            }
            
            this.swapEquipment(fromSlot, toSlot, itemGroup);
    });
  }

  handleRemoveEquipment() {
    this.game.on(HudPlayerEvents.HUD_PLAYER_UNEQUIP_ITEM, (event: unknown) => {
        const { fromSlot, itemGroup } = event as UnequipItemPayload;
        
        this.equipment.removeEquipment(fromSlot);
        const emptySlot = this.inventory.findFirstEmptySlot();
        if (emptySlot !== null) {
            this.inventory.addItemToSlot(itemGroup.getItem().getId(), itemGroup.getQuantity(), emptySlot);
        }
        this.removeEquipmentStats(itemGroup);

        this.inventory.emitInventoryUpdate();
        this.updatePlayerInfoHud(this);
    });
  }

  handleNpcBasicAttack() {
    this.eventManager.on("npc-attack-basic", ({ pos, range, damage, actor}) => {
      let diff = this.pos.sub(pos);
      if (diff.distance() > range) {
        return;
      }
      const healthAfterDamage = this.receiveDamage(damage, actor);
      this.updateHealth(healthAfterDamage);
    });
  }

  handleMonsterRewards() {
    this.eventManager.on("npc-aggresive-died", ({ actor, rewards}) => {
      if(this.name === actor.name) {
        if(rewards.exp) {
          this.progress.exp += rewards.exp;
          console.log(`${this.name} has received ${rewards.exp} experience points`);
          this.isLvlUp(this.progress.exp) && this.lvlUp();
        }
      }
    });
  }

  private addEquipmentStats(item: ItemInterface): void {
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

  private removeEquipmentStats(itemGroup: ItemGroup): void {
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


  isLvlUp(exp: number): boolean {
    return exp >= this.progress.expNextLevel;
  }
  
  lvlUp() {
    this.stats.level++;
    const diffExp = this.progress.exp - this.progress.expNextLevel;
    this.progress.exp = diffExp;
    this.progress.expNextLevel += (this.progress.expNextLevel*1.5)+50;

    Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_STATS_UPDATE, {stats: this.stats});
  }

  private playerBasicAttack() {
    if(++this.attackMode > 2) {
      this.attackMode = 0;
    }

    const eventData = {
      actor: this,
      pos: this.pos,
      direction: this.direction,
      range: 20,
      damage: this.calculatePhysicalDamage(),
    }
    this.eventManager.emit("player-attack-basic", eventData);
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
    this.movementMode = animationMode.RUN;
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.vel = Vector.Zero;
    this.movementSpeed = this.isRunning ? this.originalSpeed * 2 : this.originalSpeed;
    this.movementMode = animationMode.IDLE;

    const runKey = Config.getControls().keyboard.movement.run as Keys;

    if(this.isRunning && !engine.input.keyboard.isHeld(runKey)) {
      this.isRunning = false;
      this.movementMode = animationMode.WALK;
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
      console.log("Player health depleted, resetting player...");
      Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_HEALTH_DEPLETED, { onRevive: this.resetPlayer });
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

  private updateHealth(health: number): void {
    this.setHealth(health);
    Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_REMAINING_HP, {remainingHP: this.getHealth()});
  }

  public resetPlayer = () => {
    this.pos = this.originalPosition;
    this.isDead = false;
    this.direction = animationDirection.DOWN;
    this.deathMessageShown = false;
    this.updateHealth(this.getMaxHealth());
  }

  public getEquipment(): PlayerEquipment {
    return this.equipment;
  }

   public getProgress(): PlayerProgressType {
    return this.progress;
  }

  public updatePlayerInfoHud(player: Player) {
        const data = {
            nickname: player.name,
            stats: player.getStats(),
            equipment: player.getEquipment().equipment,
            equipmentSlots: player.getEquipment().equipmentSlots,
            totalHP: player.getMaxHealth(),
            remainingHP: player.getHealth()
        };

        Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_INFO_UPDATE, data);
    }
}
