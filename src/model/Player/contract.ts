import { Sprite, Animation, Vector, EventEmitter, Actor } from "excalibur";
import { ActorStats, AnimationDirection } from "../ExtendedActor/contract";
import { InventoryProps } from "model/Inventory/contract";
import { SlotType } from "./types/SlotType.enum";
import { ItemGroup } from "model/Item/ItemGroup";

export interface PlayerProps {
  pos: Vector;
  name: string;
  progress: PlayerProgressType;
  stats: ActorStats;
  inventory: InventoryProps;
  equipment?: EquipmentPropsType;
  eventEmitter: EventEmitter;
  currentHealth;
  maxHealth;
}

export type EquipmentPropsType = Partial<Record<SlotType, EquipmentProps>>;

export type EquipmentType = Partial<Record<SlotType, ItemGroup>>;

export type EquipmentSlotsType = Map<SlotType, { x: number, y: number }>;


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
  equipment?: EquipmentPropsType;
};

export interface EquipmentProps {
  itemId: number;
  quantity: number;
}