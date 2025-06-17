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
        const data = {
            nickname: player.name,
            stats: player.getStats(),
            equipment: player.getEquipment().equipment,
            equipmentSlots: player.getEquipment().equipmentSlots,
            totalHP: player.getMaxHealth(),
            remainingHP: player.getHealth()
        };

        Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_INFO_UPDATE, data);
    }
}