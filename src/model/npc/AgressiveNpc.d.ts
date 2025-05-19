import { Npc } from "./Npc";
import { ExtendedActor } from "../ExtendedActor/ExtendedActor";
import { RewardType } from "../../scenes/Level1/contract";
import { AgressiveNpcType } from "./contract";
export declare const EnemiesCollisionGroup: import("excalibur").CollisionGroup;
export type Drop = {
    id: number;
    name: string;
    quantity: number;
    probability: number;
};
export declare class AgressiveNpc extends Npc {
    protected attacking: boolean;
    protected taunted: boolean;
    protected rewards: RewardType;
    constructor({ npcName, pos, sprite, spriteSize, stats, rewards, collisionType, eventEmitter }: AgressiveNpcType);
    isTaunted(): boolean;
    toggleTaunted(): void;
    isAttacking(): boolean;
    toggleAttacking(): void;
    protected passiveHeal(): void;
    protected calculateDamage(attacker: ExtendedActor, defender: ExtendedActor): number;
    protected receiveDamage(damage: number, actor: ExtendedActor): void;
}
