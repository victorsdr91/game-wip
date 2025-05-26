import { Vector, CollisionType, CollisionGroup, EventEmitter } from "excalibur";

export interface ActorStats {
    level: number;
    f_attack: number;
    f_defense: number;
    m_attack: number;
    m_defense: number;
    speed: number;
    cSpeed: number;
    agi: number;
    con: number;
}

export interface ExtendedActorType { 
    name: string;
    pos: Vector;
    width: number;
    height: number;
    collisionType: CollisionType;
    collisionGroup: CollisionGroup;
    maxHealth: number;
    currentHealth?:number;
    stats: ActorStats;
    eventEmitter: EventEmitter;
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

export interface useAnimationInput {
    mode: animationMode,
    direction: animationDirection,
}