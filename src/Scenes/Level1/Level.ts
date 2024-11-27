import { Engine, Scene } from "excalibur";
import { npcType, NPCTypes, playerInfoType, worldInfoType } from "./contract";
import { Player } from "../../model/Player/Player";

import { Resources, worldLoader } from "./resources";
import { PacificNpc } from "../../model/npc/PacificNpc";
import { GameText } from "../MainMenu/ui/GameText";


export class Level extends Scene {
    private _playerInfo: playerInfoType;
    private _npcsInfo: Array<npcType>;
    private player: Player;
    
    constructor (worldInfo: worldInfoType) {
        super();
        this._playerInfo = worldInfo.playerInfo;
        this._npcsInfo = worldInfo.npcList;
    }

    onInitialize(engine: Engine): void {
        engine.start(worldLoader).then(() => {
            Resources.Level1Map.addToScene(this);
        });
    }

    onActivate(): void {
        this.loadPlayer();
        this.loadNpcs();
    }

    private loadPlayer(): void {
        this.player = new Player(this._playerInfo.position, this._playerInfo.nickname);
        const nickname = new GameText(this._playerInfo.nickname, 6, this._playerInfo.position);
        this.player.z = this._playerInfo.zIndex;
        this.add(this.player);
        this.camera.strategy.lockToActor(this.player);
        this.camera.zoom = 1.5;
    }

    private loadNpcs(): void {
        this._npcsInfo.forEach((npcType) => {
            let npc;
            if(npcType.type === NPCTypes.PACIFIC) {
                npc = new PacificNpc({
                    npcName: npcType.npcName,
                    pos: npcType.pos,
                    health: npcType.health,
                    sprite: Resources[npcType.sprite],
                    dialogue: npcType.dialogue
                });
            }
            this.add(npc);
        }) 
    }
}