import { Actor, EventEmitter, Side, Vector } from "excalibur";
import { ActorStats, ExtendedActorType } from "./contract";
export declare abstract class ExtendedActor extends Actor {
    protected stats: ActorStats;
    protected speed: number;
    protected playerSpeed: number;
    protected playerFrameSpeed: number;
    private health;
    colliding: boolean;
    collisionSide: Side | null | undefined;
    protected target: ExtendedActor | undefined;
    protected event: EventEmitter;
    protected originalPosition: Vector;
    constructor({ pos, width, height, collisionType, collisionGroup, stats, eventEmitter }: ExtendedActorType);
    setHealth(health: number): void;
    getHealth(): number;
    getStats(): ActorStats;
    getMaxHealth(): number;
    protected returnToOriginalPosition(): void;
}
