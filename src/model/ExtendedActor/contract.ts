import { Vector, CollisionType, CollisionGroup, EventEmitter } from "excalibur";
import { AttackType, DamageType, ElementType } from "./types/AttackType.enum";
import { ExtendedActor } from "./ExtendedActor";


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
    f_damage: number;
    m_damage: number;
    critical_rate: number;
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

export enum AnimationMode {
    IDLE = "idle",
    WALK = "walk",
    RUN = "run",
    DAMAGED = "damaged",
    DIE = "die"
}

export enum AnimationDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}

export interface useAnimationInput {
    mode: AnimationMode,
    direction: AnimationDirection,
}

export interface Attack {
    from: ExtendedActor;
    pos: Vector;
    direction: AnimationDirection;
    damageType: DamageType;
    type: AttackType;
    element: ElementType;
    range: number;
    damage: number;
    effect?: () => void;
}