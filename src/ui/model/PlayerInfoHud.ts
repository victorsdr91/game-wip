import { EventEmitter } from "excalibur";
import { Player } from "../../model/Player/Player";

export class PlayerInfoHud {
    private nickname: HTMLElement;
    private lvl: HTMLElement;
    private remainingHP: HTMLElement;
    private totalHP: HTMLElement;
    private hpBar: HTMLElement;
    private playerTotalHP: number;
    private playerDeadPopup:HTMLElement;
    private playerDeadReviveButton: HTMLElement;

    private eventEmitter: EventEmitter;

    constructor({eventEmitter}) {
        this.eventEmitter = eventEmitter; 
        this.buildPlayerHUD();
        this.buildPlayerDeathPopup();

        this.subscribePlayerEvents();
    }

    private buildPlayerHUD(){
        const $nickname = document.getElementById('player-nickname');
        const $lvl =  document.getElementById('player-level');
        const $remainingHP = document.getElementById('remaining-hp-points');
        const $totalHP = document.getElementById('total-hp-points');
        const $hpBar = document.getElementById('remaining-hp');

        if($nickname && $lvl && $remainingHP && $totalHP && $hpBar) {
            this.nickname = $nickname;
            this.lvl = $lvl;
            this.remainingHP = $remainingHP;
            this.totalHP = $totalHP;
            this.hpBar = $hpBar;
        }
    }

    private buildPlayerDeathPopup() {
        const $playerDeadPopup = document.getElementById("player-dead-popup");
        const $playerDeadReviveButton = document.getElementById("player-revive-button");

        if($playerDeadPopup && $playerDeadReviveButton) {
            this.playerDeadPopup = $playerDeadPopup;
            this.playerDeadReviveButton = $playerDeadReviveButton;
        }
    }

    private updateNickname(nickname: string):void {
        this.nickname.innerHTML = nickname;
    }

    public updateLvl(lvl: number): void {
        this.lvl.innerHTML = lvl.toString();
    }

    private updateTotalHP(totalHP: number): void {
        this.totalHP.innerHTML = totalHP.toString();
        this.playerTotalHP = totalHP;
    }

    public updateRemainingHP(remainingHP: number): void {
        this.remainingHP.innerHTML = remainingHP.toString();
        const hpPercentage = Math.round(remainingHP*100/this.playerTotalHP);
        this.hpBar.style.width = `${hpPercentage}%`;
    }

    public updateInformation(player: Player): void {
        this.updateNickname(player.nickname.text);
        this.updateLvl(player.getStats().level);
        this.updateTotalHP(player.getMaxHealth());
        this.updateRemainingHP(player.getHealth());
    }

    private subscribePlayerEvents() {
        this.eventEmitter.on('player-health-update', 
            ({health}) => {
                this.updateRemainingHP(health);
            });
        this.eventEmitter.on('player-lvl-update', 
            ({newLvl}) => {
                this.updateLvl(newLvl);
            });

        this.eventEmitter.on('player-health-depleted',
            ({callback}) => {
                this.playerDeadPopup.classList.remove('hide');
                this.playerDeadPopup.classList.add('show');
                this.playerDeadReviveButton.onclick = () => {
                    this.playerDeadPopup.classList.remove('show');
                    this.playerDeadPopup.classList.add('hide');
                    callback();
                };
            }
        );
    }
}