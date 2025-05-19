import { EventEmitter } from "excalibur";
import { PlayerInfoHud } from "./model/PlayerInfoHud";
import { Player } from "../model/Player/Player";
export interface HudInterface {
    eventEmitter: EventEmitter;
}
export declare class Hud {
    private rootElement;
    private playerInfo;
    constructor({ eventEmitter }: HudInterface);
    show(): void;
    hide(): void;
    updatePlayerInfoHud(player: Player): void;
    getPlayerInfoHUD(): PlayerInfoHud;
}
