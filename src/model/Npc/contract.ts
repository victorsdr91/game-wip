import { CollisionGroup, CollisionType, EventEmitter, ImageSource, Vector } from "excalibur";
import { RewardType } from "../../scenes/Test/contract";
import { ActorStats } from "../ExtendedActor/contract";
import { EventMap } from "model/EventManager/contract";

export interface NpcType {
    name: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    sprite: string;
    spriteSize: {
        width: number;
        height: number;
    };
    collisionType: CollisionType;
    collisionGroup: CollisionGroup;
    stats: ActorStats;
    currentHealth?: number;
    maxHealth: number;
    events?: EventMap;
    eventEmitter: EventEmitter;
}

export interface PacificNpcType {
    name: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    sprite: string;
    spriteSize: {
        width: number;
        height: number;
    };
    collisionType: CollisionType;
    stats: ActorStats;
    currentHealth?: number;
    maxHealth: number;
    events?: EventMap;
    eventEmitter: EventEmitter;
}

export interface AgressiveNpcType {
    name: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    sprite: string;
    spriteSize: {
        width: number;
        height: number;
    };
    collisionType: CollisionType;
    stats: ActorStats;
    currentHealth?: number;
    maxHealth: number;
    events?: EventMap;
    eventEmitter: EventEmitter;
    rewards: RewardType;
}