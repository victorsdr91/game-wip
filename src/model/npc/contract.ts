import { CollisionGroup, CollisionType, EventEmitter, ImageSource, Vector } from "excalibur";
import { RewardType } from "../../scenes/Level1/contract";
import { ActorStats } from "../ExtendedActor/contract";

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
    eventEmitter: EventEmitter;
    dialogue: string[];
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
    eventEmitter: EventEmitter;
    rewards: RewardType;
}