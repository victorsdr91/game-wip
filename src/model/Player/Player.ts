import { Animation, CollisionType, Engine, Keys, Vector, GraphicsGroup, CollisionGroupManager, Sprite } from "excalibur";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { PlayerAnimation } from "./PlayerAnimations";
import { PlayerProps } from "./contract";
import { Inventory } from "model/Inventory/Inventory";
import { PlayerEquipment } from "./PlayerEquipment";
import { WereableItem } from "model/Item/WereableItem";
import { KeyboardConfig, KeyboardConfigProps, KeyCallback } from "state/config/KeyboardConfig";
import { SlotType } from "./types/SlotType.enum";
import { ItemGroup } from "model/Item/ItemGroup";
import { ItemInterface } from "model/Item/interface/ItemInterface";
import PlayerEventsHandler from "services/EventsHandler/PlayerEventsHandler";
import { MovementDirection, MovementMode } from "services/systems/Movement/types/movement.enum";
import { MovementComponent } from "services/systems/Movement/components/MovementComponent";
import { release } from "os";
import { StatsEnum } from "services/systems/common/components/types/stats.enum";
import { CombatComponent } from "services/systems/Combat/components/CombatComponent";

export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends ExtendedActor {
  private playerAnimation: PlayerAnimation;
  private keyboardConfig: KeyboardConfig;
  private attackMode: number = 0;
  private inventory: Inventory;
  private deathMessageShown: boolean = false;
  private equipment: PlayerEquipment;
  private playerEventHandler: PlayerEventsHandler;

  private combat: CombatComponent;

  constructor({pos, name, currentHealth, maxHealth, progress, stats, inventory, equipment, skills}: PlayerProps) {
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
    });
    this.experience.experience = progress.exp;
    this.playerAnimation = new PlayerAnimation(200);
    this.inventory = new Inventory(inventory);
    this.equipment = new PlayerEquipment({equipment});

    this.keyboardConfig = new KeyboardConfig(this.getKeyCallbackMap());
    this.playerEventHandler = new PlayerEventsHandler({player: this, eventEmitter: this.events});

    this.combat = new CombatComponent(skills);
    this.addComponent(this.combat);
  }

  private getKeyCallbackMap(): KeyboardConfigProps  {
    const keyCallbackMap: KeyboardConfigProps = {
      movement: new Map<string, KeyCallback>(),
      skills: new Map<string, {press: KeyCallback, release: KeyCallback}>(),
      shortcuts: new Map<string, KeyCallback>()
    };

    keyCallbackMap.movement.set("left", () => { this.move(MovementDirection.LEFT, MovementMode.WALK)});
    keyCallbackMap.movement.set("right", () => { this.move(MovementDirection.RIGHT, MovementMode.WALK)});
    keyCallbackMap.movement.set("up", () => { this.move(MovementDirection.UP, MovementMode.WALK)});
    keyCallbackMap.movement.set("down", () => { this.move(MovementDirection.DOWN, MovementMode.WALK)});
    keyCallbackMap.movement.set("run", () => { this.setMovementMode(MovementMode.RUN) });

    keyCallbackMap.skills.set("first", {press: () => { this.useSkill(0) }, release: () => { this.executeSkill() }});
    keyCallbackMap.skills.set("second", {press: () => { this.useSkill(1) }, release: () => { this.executeSkill() }});
    keyCallbackMap.skills.set("third", {press: () => { this.useSkill(2) }, release: () => { this.executeSkill() }});
    keyCallbackMap.skills.set("fourth", {press: () => { this.useSkill(3) }, release: () => { this.executeSkill() }});
    keyCallbackMap.skills.set("fifth", {press: () => { this.useSkill(4) }, release: () => { this.executeSkill() }});

    keyCallbackMap.shortcuts.set("bag", () => { this.playerEventHandler.toggleInventory() });
    keyCallbackMap.shortcuts.set("player", () => { this.playerEventHandler.toggleProfile() });
    keyCallbackMap.shortcuts.set("interact", () => { this.playerEventHandler.interact() });

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
          this.combat.isInCombat = false;
        });
      });
    });
  }

  useSkill(skillIndex: number): void {
    this.combat.isInCombat = true;
    const skill = this.combat.skills[skillIndex];
    if(skill) {
      this.combat.currentSkill = {skill, isExecuted: false};
    }
  }

  executeSkill(): void {
    if(this.combat.currentSkill) {
      this.combat.executeSkill();
    }
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
          const currentStatValue = this.stats.getStat(statKey as StatsEnum);
          if(currentStatValue) {
            this.stats.setStat(statKey as StatsEnum, currentStatValue + itemStats[statKey]);
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
          const currentStatValue = this.stats.getStat(statKey as StatsEnum);
          if(currentStatValue) {
            this.stats.setStat(statKey as StatsEnum, currentStatValue - itemStats[statKey]);
          }
        });
      }
    }
  }
  
  public updateHud(): void {
    this.playerEventHandler.updatePlayerInfoHud();
  }

  onPreUpdate(engine: Engine, elapsedMs: number): void {
    super.onPreUpdate(engine, elapsedMs);

    this.keyboardConfig.bindKeys(engine);
    let animationGraphic = this.playerGraphic(this.playerAnimation.usePlayerAnimation({ mode: this.movement.mode, direction: this.movement.direction}));
    
    if(this.combat.isInCombat) {
      animationGraphic = this.playerGraphic(this.playerAnimation.useAttackAnimation(this.movement.direction, this.attackMode || 0));
    } else if(!this.health.isAlive()) {
      animationGraphic = this.playerGraphic(this.playerAnimation.useDieAnimation());
    }

    this.graphics.use(animationGraphic);
  }

  onPostUpdate(engine: Engine, elapsed: number): void {
    if(!this.health.isAlive() && !this.deathMessageShown) {
      this.playerEventHandler.sendPlayerDead(this.resetPlayer);
      this.deathMessageShown = true;
    }
  }

  public playerGraphic(animation: Animation | Sprite): GraphicsGroup {
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
    this.health.health = health;
    this.playerEventHandler.updateHealthOnHud(this.health.health);
  }

  public resetPlayer = () => {
    this.pos = this.get(MovementComponent)?.originalPosition || new Vector(0, 0);
    this.health.health = this.health.maxHealth;
    this.movement.direction = MovementDirection.DOWN;
    this.deathMessageShown = false;
  }

  public getEquipment(): PlayerEquipment {
    return this.equipment;
  }

  public getInventory(): Inventory {
    return this.inventory;
  }
}
