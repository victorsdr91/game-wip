import { Sprite, Animation, Vector, EventEmitter } from "excalibur";
import { ActorStats } from "../ExtendedActor/contract";
import { InventoryProps } from "model/Inventory/contract";

export interface PlayerProps {
  pos: Vector;
  name: string;
  progress: PlayerProgressType;
  stats: ActorStats;
  inventory: InventoryProps;
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