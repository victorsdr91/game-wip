import { CollisionType, Engine, EventEmitter, Scene, Vector } from "excalibur";
import { NpcInterface, playerInfoType, worldInfoType } from "./contract";
import { Resources, worldLoader } from "./resources";
import { Player } from "../../model/Player/Player";
import { Hud } from "../../ui/Hud";
import { PlayerProps } from "../../model/Player/contract";
import { EventManager } from "model/EventManager/EventManager";
import { CombatSystem } from "services/systems/Combat/CombatSystem";
import { HealthSystem } from "services/systems/Health/HealthSystem";
import { MovementSystem } from "services/systems/Movement/MovementSystem";
import { Npc } from "model/Npc/Npc";

export class TestLevel extends Scene {
    private _playerInfo: playerInfoType;
    private _npcInfo: NpcInterface[];
    private hud: Hud;
    private player: Player | undefined;
    private eventEmitter: EventEmitter;
    currentWorldPos: Vector = new Vector(0, 0);
    
    constructor (worldInfo: worldInfoType) {
        super();
        this._playerInfo = worldInfo.playerInfo;
        this._npcInfo = worldInfo.Npcs;
        this.eventEmitter = new EventEmitter();
        this.hud = new Hud({eventEmitter: this.eventEmitter});
    }

    onInitialize(engine: Engine): void {
        EventManager.levelEventEmitter = this.eventEmitter;
        this.loadSystems();
        this.loadPlayer().then(() => {  this.loadHUD(); });
        this.loadNpcs();
        
        engine.start(worldLoader).then(() => {
            Resources.Level1Map.addToScene(this);
        });

         engine.input.pointers.on('down', (evt) => {
            this.currentWorldPos = engine.screen.pageToWorldCoordinates(new Vector(evt.pagePos.x, evt.pagePos.y));
            document.documentElement.style.setProperty('--pointer-x', evt.pagePos.x.toString() + 'px');
            document.documentElement.style.setProperty('--pointer-y', evt.pagePos.y.toString() + 'px');
        });
    }

    loadSystems(): void {
        this.world.add(new CombatSystem(this.world));
        this.world.add(new HealthSystem(this.world));
        this.world.add(new MovementSystem(this.world));
    }

    private async loadPlayer(): Promise<void> {
        const playerProps: PlayerProps = {
            pos: this._playerInfo.position,
            name: this._playerInfo.nickname,
            progress: this._playerInfo.progress,
            inventory: this._playerInfo.inventory,
            equipment: this._playerInfo.equipment,
            stats: this._playerInfo.stats,
            currentHealth: this._playerInfo.health.current,
            maxHealth: this._playerInfo.health.total,
            skills: this._playerInfo.skills,
        };

        this.player = new Player(playerProps);
        this.player.z = this._playerInfo.zIndex;
        this.add(this.player);
        this.camera.strategy.lockToActor(this.player);
        this.camera.zoom = 2.3;
    }

    private loadNpcs(): void {
        this._npcInfo.forEach((npc) => {
            const worldNpc = new Npc({
                    name: npc.name,
                    type: npc.type,
                    pos: npc.pos,
                    spriteSize: npc.spriteSize,
                    sprite: npc.sprite,
                    events: npc.events,
                    collisionType: CollisionType.Fixed,
                    stats: npc.stats,
                    currentHealth: npc.health.current,
                    maxHealth: npc.health.total,
                    skills: npc.skills || []
                });
            this.add(worldNpc);
        });
    }

    private loadHUD(): void {
        this.hud.toogleShow();
    }
}