import { Engine } from "excalibur";
import { worldInfoType } from "./scenes/Level1/contract";
import { configType } from "./contract";
declare class Game extends Engine {
    private worldInfo;
    private config;
    constructor(worldInfo: worldInfoType, config: configType);
    initialize(): void;
}
export declare const game: Game;
export {};
