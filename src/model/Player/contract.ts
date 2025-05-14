import { Sprite, Animation } from "excalibur";

export interface PlayerAnimations {
  idle: SpriteObject;
  walk: AnimationObject;
  run: AnimationObject;
  damaged: AnimationObject;
  die: Animation;
};

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

export interface useAnimationInput {
    mode: animationMode,
    direction: animationDirection,
}

export enum animationMode {
    IDLE = "idle",
    WALK = "walk",
    RUN = "run",
    DAMAGED = "damaged",
    DIE = "die"
}

export enum animationDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}