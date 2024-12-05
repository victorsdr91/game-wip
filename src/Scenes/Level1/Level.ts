import { CollisionEndEvent, CollisionStartEvent, Engine, Scene, Side, Vector } from "excalibur";
import { NPCTypes, playerInfoType, worldInfoType } from "./contract";
import { Player } from "../../model/Player/Player";

import { Resources, worldLoader } from "./resources";
import { PacificNpc } from "../../model/npc/PacificNpc";
import { AgressiveNpc } from "../../model/npc/AgressiveNpc";
import { Slime } from "../../model/npc/Slime";
import { ExtendedActor } from "../../model/ExtendedActor/ExtendedActor";


export class Level extends Scene {
    private _playerInfo: playerInfoType;
    private player: Player;
    private pacificNpcs: PacificNpc[];
    private agressiveNpcs: AgressiveNpc[];

    
    constructor (worldInfo: worldInfoType) {
        super();
        this._playerInfo = worldInfo.playerInfo;
        this.pacificNpcs = new Array<PacificNpc>();
        this.agressiveNpcs = new Array<AgressiveNpc>();

        worldInfo.npcList.forEach((npc) => {
            if(npc.type === NPCTypes.PACIFIC) {
                this.pacificNpcs.push(
                    new PacificNpc({
                        npcName: npc.npcName,
                        pos: npc.pos,
                        sprite: Resources[npc.sprite],
                        spriteSize: npc.spriteSize,
                        dialogue: npc.dialogue,
                        stats: npc.stats,
                    })
                );
            } else if(npc.type === NPCTypes.AGRESSIVE) {
                this.agressiveNpcs.push(
                    new Slime({
                        npcName: npc.npcName,
                        pos: npc.pos,
                        spriteSize: npc.spriteSize,
                        sprite: Resources[npc.sprite],
                        stats: npc.stats,
                    })
                );
            }
        });
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
        this.player = new Player(this._playerInfo.position, this._playerInfo.nickname, this._playerInfo.stats);
        this.player.z = this._playerInfo.zIndex;
        this.add(this.player);
        this.camera.strategy.lockToActor(this.player);
        this.camera.zoom = 2.3;

    }

    private loadNpcs(): void {
        this.pacificNpcs.forEach((npc) => {
            this.add(npc);
        });
        this.agressiveNpcs.forEach((npc) => {
            this.add(npc);
        });
    }
       

}