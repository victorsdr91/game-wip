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
    pos: Vector;
    width: number;
    height: number;
    collisionType: CollisionType;
    collisionGroup: CollisionGroup;
    stats: ActorStats;
    eventEmitter: EventEmitter;
}
