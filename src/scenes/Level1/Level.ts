import { CollisionType, Engine, EventEmitter, Scene, Vector } from "excalibur";
import { playerInfoType, worldInfoType } from "./contract";
import { Resources, worldLoader } from "./resources";
import { PacificNpc } from "../../model/npc/PacificNpc";
import { AgressiveNpc } from "../../model/npc/AgressiveNpc";
import { Slime } from "../../model/npc/Slime";
import { Player } from "../../model/Player/Player";
import { Hud } from "../../ui/Hud";
import { PlayerProps } from "../../model/Player/contract";


export class Level extends Scene {
    private _playerInfo: playerInfoType;
    private hud: Hud;
    private player: Player | undefined;
    private pacificNpcs: PacificNpc[];
    private agressiveNpcs: AgressiveNpc[];
    private eventEmitter: EventEmitter;
    currentWorldPos: Vector = new Vector(0, 0);

    
    constructor (worldInfo: worldInfoType) {
        super();
        this._playerInfo = worldInfo.playerInfo;
        this.pacificNpcs = new Array<PacificNpc>();
        this.agressiveNpcs = new Array<AgressiveNpc>();
        this.eventEmitter = new EventEmitter();
        this.hud = new Hud({eventEmitter: this.eventEmitter});


        worldInfo.pacificNPCs.forEach((npc) => {
            this.pacificNpcs.push(
                new PacificNpc({
                    name: npc.name,
                    pos: npc.pos,
                    sprite: Resources[npc.sprite],
                    spriteSize: npc.spriteSize,
                    dialogue: npc.dialogue || [""],
                    collisionType: CollisionType.Fixed,
                    stats: npc.stats,
                    currentHealth: npc.currentHealth,
                    maxHealth: npc.maxHealth,
                    eventEmitter: this.eventEmitter,
                })
            );
        });
         worldInfo.agressiveNPCs.forEach((npc) => {
            let npcToPush: AgressiveNpc;
             if(npc.name === "Slime") {
                npcToPush = new Slime({
                    name: npc.name,
                    pos: npc.pos,
                    spriteSize: npc.spriteSize,
                    sprite: npc.sprite,
                    collisionType: CollisionType.Active,
                    stats: npc.stats,
                    currentHealth: npc.currentHealth,
                    maxHealth: npc.maxHealth,
                    rewards: npc.rewards || { exp: 0 },
                    eventEmitter: this.eventEmitter,
                });
                this.agressiveNpcs.push(npcToPush);
            }
        });
    }

    onInitialize(engine: Engine): void {
        engine.start(worldLoader).then(() => {
            Resources.Level1Map.addToScene(this);
        });

         engine.input.pointers.on('down', (evt) => {
            this.currentWorldPos = engine.screen.pageToWorldCoordinates(new Vector(evt.pagePos.x, evt.pagePos.y));
            document.documentElement.style.setProperty('--pointer-x', evt.pagePos.x.toString() + 'px');
            document.documentElement.style.setProperty('--pointer-y', evt.pagePos.y.toString() + 'px');
        });
    }

    onActivate(): void {
        this.loadPlayer().then(() => {  this.loadHUD(); });
        this.loadNpcs();
    }

    private async loadPlayer(): Promise<void> {
        const playerProps: PlayerProps = {
            pos: this._playerInfo.position,
            name: this._playerInfo.nickname,
            progress: this._playerInfo.progress,
            inventory: this._playerInfo.inventory,
            equipment: this._playerInfo.equipment,
            stats: this._playerInfo.stats,
            eventEmitter: this.eventEmitter,
            currentHealth: this._playerInfo.currentHealth,
            maxHealth: this._playerInfo.maxHealth,
        };

        this.player = new Player(playerProps);
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
        this.hud.toogleShow();
    }
}