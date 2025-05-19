"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hud = void 0;
const PlayerInfoHud_1 = require("./model/PlayerInfoHud");
class Hud {
    constructor({ eventEmitter }) {
        const $rootElement = document.getElementById('hud');
        if ($rootElement) {
            this.rootElement = $rootElement;
        }
        ;
        this.playerInfo = new PlayerInfoHud_1.PlayerInfoHud(eventEmitter);
    }
    show() {
        var _a, _b;
        (_a = this.rootElement) === null || _a === void 0 ? void 0 : _a.classList.remove('hide');
        (_b = this.rootElement) === null || _b === void 0 ? void 0 : _b.classList.add('show');
    }
    hide() {
        var _a, _b;
        (_a = this.rootElement) === null || _a === void 0 ? void 0 : _a.classList.remove('show');
        (_b = this.rootElement) === null || _b === void 0 ? void 0 : _b.classList.add('hide');
    }
    updatePlayerInfoHud(player) {
        this.playerInfo.updateInformation(player);
    }
    getPlayerInfoHUD() {
        return this.playerInfo;
    }
}
exports.Hud = Hud;
