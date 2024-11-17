import { Scene } from "excalibur";
import { PlayerInfoType } from "./contract";
import { Player } from "../../player";
import { Resources } from "../../resources";

export class Level1 extends Scene {
    private _playerInfo: PlayerInfoType;
    private player: Player;
    
    constructor (playerInfo) {
        super();
        this._playerInfo = playerInfo;
    }

    onActivate() {
        this.player = new Player(this._playerInfo.position);
        this.player.z = this._playerInfo.zIndex;
        this.add(this.player);
        this.camera.strategy.lockToActor(this.player);
        this.camera.zoom = 1.5;
        Resources.Level1Map.addToScene(this);
    }
}