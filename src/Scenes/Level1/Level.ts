import { Engine, EventEmitter, Scene } from "excalibur";
import { NPCTypes, playerInfoType, worldInfoType } from "./contract";
import { Resources, worldLoader } from "./resources";
import { PacificNpc } from "../../model/npc/PacificNpc";
import { AgressiveNpc, Drop } from "../../model/npc/AgressiveNpc";
import { Slime } from "../../model/npc/Slime";
import { Player } from "../../model/Player/Player";
import { Hud } from "../../ui/Hud";


export class Level extends Scene {
    private _playerInfo: playerInfoType;
    private hud: Hud;
    private player: Player;
    private pacificNpcs: PacificNpc[];
    private agressiveNpcs: AgressiveNpc[];
    private eventEmitter: EventEmitter;

    
    constructor (worldInfo: worldInfoType) {
        super();
        this._playerInfo = worldInfo.playerInfo;
        this.pacificNpcs = new Array<PacificNpc>();
        this.agressiveNpcs = new Array<AgressiveNpc>();
        this.eventEmitter = new EventEmitter();
        this.hud = new Hud({eventEmitter: this.eventEmitter});

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
                        eventEmitter: this.eventEmitter,
                    })
                );
            } else if(npc.type === NPCTypes.AGRESSIVE) {
                let npcToPush: AgressiveNpc;
                if(npc.npcName === "Slime") {
                    npcToPush = new Slime({
                        npcName: npc.npcName,
                        pos: npc.pos,
                        spriteSize: npc.spriteSize,
                        sprite: Resources[npc.sprite],
                        stats: npc.stats,
                        rewards: npc.rewards,
                        eventEmitter: this.eventEmitter,
                    });
                    this.agressiveNpcs.push(npcToPush);
                }
                
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
        this.loadHUD();
    }

    private loadPlayer(): void {
        this.player = new Player(this._playerInfo.position, this._playerInfo.nickname, this._playerInfo.progress, this._playerInfo.stats, this.eventEmitter);
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

    private loadHUD(): void {
        this.hud.updatePlayerInfoHud(this.player);
        this.hud.show();
    }
       

}