import { Engine, Scene } from "excalibur";
import { worldInfoType } from "./contract";
export declare class Level extends Scene {
    private _playerInfo;
    private hud;
    private player;
    private pacificNpcs;
    private agressiveNpcs;
    private eventEmitter;
    constructor(worldInfo: worldInfoType);
    onInitialize(engine: Engine): void;
    onActivate(): void;
    private loadPlayer;
    private loadNpcs;
    private loadHUD;
}
