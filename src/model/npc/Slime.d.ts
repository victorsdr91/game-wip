import { Engine, Graphic } from "excalibur";
import { AgressiveNpc } from "./AgressiveNpc";
import { AgressiveNpcType } from "./contract";
export declare class Slime extends AgressiveNpc {
    constructor({ npcName, pos, sprite, spriteSize, collisionType, stats, rewards, eventEmitter }: AgressiveNpcType);
    onInitialize(): void;
    useGraphic(graphic: Graphic): void;
    handleEvents(): void;
    handlePlayerAttackEvent(): void;
    handleAttack(): void;
    onPreUpdate(engine: Engine, elapsedMs: number): void;
}
