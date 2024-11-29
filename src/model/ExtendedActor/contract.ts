import { Sprite, Animation } from "excalibur";

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

export interface PlayerAnimations {
    idle: {
        left: Sprite;
        up: Sprite;
        right: Sprite;
        down: Sprite;
    }
    walk: {
        left: Animation;
        up: Animation;
        right: Animation;
        down: Animation;
    }
    run: {
        left: Animation;
        up: Animation;
        right: Animation;
        down: Animation;
    }
};