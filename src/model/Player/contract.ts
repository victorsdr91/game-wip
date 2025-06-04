import { Sprite, Animation, Vector, EventEmitter } from "excalibur";
import { ActorStats } from "../ExtendedActor/contract";
import { InventoryProps } from "model/Inventory/contract";
import { ItemGroup } from "model/Item/ItemGroup";
import { SlotType } from "model/Item/contract";

export interface PlayerProps {
  pos: Vector;
  name: string;
  progress: PlayerProgressType;
  stats: ActorStats;
  inventory: InventoryProps;
  equipment?: Record<SlotType, EquipmentProps>;
  eventEmitter: EventEmitter;
  currentHealth;
  maxHealth;
}

export type PlayerProgressType = {
    exp: number;
    expNextLevel: number;
}

export interface PlayerAnimations {
  idle: SpriteObject;
  walk: AnimationObject;
  run: AnimationObject;
  damaged: AnimationObject;
  die: Animation;
};

export interface AttackPlayerAnimations {
    up: Animation[];
    down: Animation[];  
    left: Animation[];
    right: Animation[];
}

export interface AnimationObject {
  up: Animation;
  down: Animation;  
  left: Animation;
  right: Animation;
}

export interface SpriteObject {
  up: Sprite;
  down: Sprite;  
  left: Sprite;
  right: Sprite;
}

export interface PlayerEquipmentProps {
  equipment?: Record<SlotType, EquipmentProps>;
};

export interface EquipmentProps {
  itemId: number;
  quantity: number;
}