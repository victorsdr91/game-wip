import { EventEmitter } from "excalibur";
import { PlayerInfoHud } from "./model/PlayerInfoHud";
import { Player } from "../model/Player/Player";

export interface HudInterface {
    eventEmitter: EventEmitter;
}

export class Hud {
    private rootElement: HTMLElement;
    private playerInfo: PlayerInfoHud;

    constructor({ eventEmitter }: HudInterface) {
        const $rootElement = document.getElementById('hud');
        if($rootElement) {
            this.rootElement = $rootElement;
        };
        this.playerInfo = new PlayerInfoHud({eventEmitter});
    }

    public show() {
        this.rootElement.classList.remove('hide');
        this.rootElement.classList.add('show');
    }

    public hide() {
        this.rootElement.classList.remove('show');
        this.rootElement.classList.add('hide');
    }

    public updatePlayerInfoHud(player: Player) {
        this.playerInfo.updateInformation(player);
    }
    
    public getPlayerInfoHUD() {
        return this.playerInfo;
    }
}