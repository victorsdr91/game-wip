import { EventEmitter } from "excalibur";
import { Player } from "../../model/Player/Player";
export declare class PlayerInfoHud {
    private nickname;
    private lvl;
    private remainingHP;
    private totalHP;
    private hpBar;
    private playerTotalHP;
    private playerDeadPopup;
    private playerDeadReviveButton;
    private eventEmitter;
    constructor(eventEmitter: EventEmitter);
    private buildPlayerHUD;
    private buildPlayerDeathPopup;
    private updateNickname;
    updateLvl(lvl: number): void;
    private updateTotalHP;
    updateRemainingHP(remainingHP: number): void;
    updateInformation(player: Player): void;
    private subscribePlayerEvents;
}
