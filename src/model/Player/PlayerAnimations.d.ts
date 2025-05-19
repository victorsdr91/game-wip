import { Animation } from "excalibur";
import { animationDirection, AttackPlayerAnimations, useAnimationInput } from "./contract";
export declare class PlayerAnimation {
    private noActionSpritesheet;
    private attackSpriteSheet;
    private playerAnimations;
    private attackAnimations;
    private playerFrameSpeed;
    constructor(playerFrameSpeed: number);
    initialize(): void;
    private loadSpriteSheet;
    private mapAnimations;
    private mapAttackAnimations;
    getAttackAnimations(): AttackPlayerAnimations;
    useAttackAnimation(direction: animationDirection, attackMode: number): Animation;
    usePlayerAnimation({ mode, direction }: useAnimationInput): Animation;
    useDieAnimation(): Animation;
}
