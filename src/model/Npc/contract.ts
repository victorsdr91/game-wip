import { CollisionGroup, CollisionType, EventEmitter, ImageSource, Vector } from "excalibur";
import { RewardType } from "../../scenes/Test/contract";
import { ActorStats } from "../ExtendedActor/contract";
import { EventMap } from "model/EventManager/contract";
import { Skill } from "services/systems/Combat/types/skill.type";

export interface NpcProps {
    name: string;
    pos: {
        x: number;
        y: number;
        z?: number;
    };
    type: NpcType;
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
    rewards?: RewardType;
    skills: Skill[];
}

export enum NpcType {
    ALLY = "ally",
    ENEMY = "enemy",
    NEUTRAL = "neutral",
    MERCHANT = "merchant",
}