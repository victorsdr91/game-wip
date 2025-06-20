import { Game } from "services/Game";
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
}