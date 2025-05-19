"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInfoHud = void 0;
class PlayerInfoHud {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.buildPlayerHUD();
        this.buildPlayerDeathPopup();
        this.subscribePlayerEvents();
    }
    buildPlayerHUD() {
        const $nickname = document.getElementById('player-nickname');
        const $lvl = document.getElementById('player-level');
        const $remainingHP = document.getElementById('remaining-hp-points');
        const $totalHP = document.getElementById('total-hp-points');
        const $hpBar = document.getElementById('remaining-hp');
        if ($nickname && $lvl && $remainingHP && $totalHP && $hpBar) {
            this.nickname = $nickname;
            this.lvl = $lvl;
            this.remainingHP = $remainingHP;
            this.totalHP = $totalHP;
            this.hpBar = $hpBar;
        }
    }
    buildPlayerDeathPopup() {
        const $playerDeadPopup = document.getElementById("player-dead-popup");
        const $playerDeadReviveButton = document.getElementById("player-revive-button");
        if ($playerDeadPopup && $playerDeadReviveButton) {
            this.playerDeadPopup = $playerDeadPopup;
            this.playerDeadReviveButton = $playerDeadReviveButton;
        }
    }
    updateNickname(nickname) {
        this.nickname.innerHTML = nickname;
    }
    updateLvl(lvl) {
        this.lvl.innerHTML = lvl.toString();
    }
    updateTotalHP(totalHP) {
        this.totalHP.innerHTML = totalHP.toString();
        this.playerTotalHP = totalHP;
    }
    updateRemainingHP(remainingHP) {
        this.remainingHP.innerHTML = remainingHP.toString();
        const hpPercentage = Math.round(remainingHP * 100 / this.playerTotalHP);
        this.hpBar.style.width = `${hpPercentage}%`;
    }
    updateInformation(player) {
        this.updateNickname(player.nickname.text);
        this.updateLvl(player.getStats().level);
        this.updateTotalHP(player.getMaxHealth());
        this.updateRemainingHP(player.getHealth());
    }
    subscribePlayerEvents() {
        this.eventEmitter.on('player-health-update', ({ health }) => {
            this.updateRemainingHP(health);
        });
        this.eventEmitter.on('player-lvl-update', ({ newLvl }) => {
            this.updateLvl(newLvl);
        });
        this.eventEmitter.on('player-health-depleted', ({ callback }) => {
            this.playerDeadPopup.classList.remove('hide');
            this.playerDeadPopup.classList.add('show');
            this.playerDeadReviveButton.onclick = () => {
                this.playerDeadPopup.classList.remove('show');
                this.playerDeadPopup.classList.add('hide');
                callback();
            };
        });
    }
}
exports.PlayerInfoHud = PlayerInfoHud;
