import { Vector, CollisionType, CollisionGroup, EventEmitter } from "excalibur";
import { AttackType, DamageType, ElementType } from "./types/AttackType.enum";
import { ExtendedActor } from "./ExtendedActor";
import { MovementDirection, MovementMode } from "services/systems/Movement/types/movement.enum";
import { Skill } from "services/systems/Combat/types/skill.type";


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
}

export interface useAnimationInput {
    mode: MovementMode,
    direction: MovementDirection,
}

export interface Attack {
    from: ExtendedActor;
    pos: Vector;
    direction: MovementDirection;
    damageType: DamageType;
    type: AttackType;
    element: ElementType;
    range: number;
    damage: number;
    effect?: () => void;
}