import { CollisionGroup, CollisionType, EventEmitter, ImageSource, Vector } from "excalibur";
import { RewardType } from "../../scenes/Level1/contract";
import { ActorStats } from "../ExtendedActor/contract";

export interface NpcType {
    npcName: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    sprite: ImageSource;
    spriteSize: {
        width: number;
        height: number;
    };
    collisionType: CollisionType;
    collisionGroup: CollisionGroup;
    stats: ActorStats;
    eventEmitter: EventEmitter;
}

export interface PacificNpcType {
    npcName: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    sprite: ImageSource;
    spriteSize: {
        width: number;
        height: number;
    };
    collisionType: CollisionType;
    stats: ActorStats;
    eventEmitter: EventEmitter;
    dialogue: string[];
}

export interface AgressiveNpcType {
    npcName: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    sprite: ImageSource;
    spriteSize: {
        width: number;
        height: number;
    };
    collisionType: CollisionType;
    stats: ActorStats;
    eventEmitter: EventEmitter;
    rewards: RewardType;
}