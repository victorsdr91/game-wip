import { Scene } from "excalibur";
import { playerInfoType, worldInfoType } from "./contract";
import { Player } from "../../model/Player/Player";

import { Resources } from "../../resources";


export class Level extends Scene {
    private _playerInfo: playerInfoType;
    private player: Player;
    
    constructor (worldInfo: worldInfoType) {
        super();
        this._playerInfo = worldInfo.playerInfo;
    }

    onActivate() {
        this.player = new Player(this._playerInfo.position);
        this.player.z = this._playerInfo.zIndex;
        this.player.setNickname(this._playerInfo.nickname);
        this.add(this.player);
        this.camera.strategy.lockToActor(this.player);
        this.camera.zoom = 1.5;
        Resources.Level1Map.addToScene(this);
    }
}