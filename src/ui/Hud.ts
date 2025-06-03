import { Player } from "../model/Player/Player";
import { Game } from "services/Game";
import { HudPlayerEvents, HudPlayerInfoUpdate } from "state/helpers/PlayerEvents";
import { GameEvents, HudToggle } from "state/helpers/GameEvents";

export class Hud {

    private show: boolean;

    constructor({}) {
        this.show = false;
    }

    public toogleShow() {
        this.show = !this.show;
        const data: HudToggle = {
            show: this.show
        };
        Game.getInstance().emit(GameEvents.HUD_TOGGLE, data);
    }

    public updatePlayerInfoHud(player: Player) {
        const data: HudPlayerInfoUpdate = {
            nickname: player.name,
            lvl: player.getStats().level,
            totalHP: player.getMaxHealth(),
            remainingHP: player.getHealth()
        };

        Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_INFO_UPDATE, data);
    }
}