import { CollisionStartEvent, Engine, Scene } from "excalibur";
import { npcType, NPCTypes, playerInfoType, spriteSize, worldInfoType } from "./contract";
import { Player } from "../../model/Player/Player";

import { Resources, worldLoader } from "./resources";
import { PacificNpc } from "../../model/npc/PacificNpc";
import { configType } from "../../contract";
import { AgressiveNpc } from "../../model/npc/AgressiveNpc";
import { Npc } from "../../model/npc/Npc";


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
                        spriteSize: spriteSize.medium,
                        dialogue: npc.dialogue,
                        stats: npc.stats,
                    })
                );
            } else if(npc.type === NPCTypes.AGRESSIVE) {
                this.agressiveNpcs.push(
                    new AgressiveNpc({
                        npcName: npc.npcName,
                        pos: npc.pos,

                        spriteSize: spriteSize.medium,
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

        this.player.on
    }

    private loadNpcs(): void {
        this.pacificNpcs.forEach((npc) => {
            this.add(npc);
        });
        this.agressiveNpcs.forEach((npc) => {
            this.add(npc);

            npc.on("collisionstart", this.handleEnemyCollision);
            npc.on("collisionend", (ev) => {
                if(ev.actor instanceof AgressiveNpc) {
                    ev.actor.colliding = false;
                }
            })
        });
    }
    
    private handleEnemyCollision(ev: CollisionStartEvent) {
        if(ev.actor instanceof AgressiveNpc && !ev.actor.colliding) {
            if(ev.other instanceof Player) {
                ev.other.setHealth(ev.other.getHealth() - 10);
                console.log("Vida del jugador: "+ev.other.getHealth());
            }
            ev.actor.colliding = true;
        };
    }
}