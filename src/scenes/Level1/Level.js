"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Level = void 0;
const excalibur_1 = require("excalibur");
const contract_1 = require("./contract");
const resources_1 = require("./resources");
const PacificNpc_1 = require("../../model/npc/PacificNpc");
const Slime_1 = require("../../model/npc/Slime");
const Player_1 = require("../../model/Player/Player");
const Hud_1 = require("../../ui/Hud");
class Level extends excalibur_1.Scene {
    constructor(worldInfo) {
        super();
        this._playerInfo = worldInfo.playerInfo;
        this.pacificNpcs = new Array();
        this.agressiveNpcs = new Array();
        this.eventEmitter = new excalibur_1.EventEmitter();
        this.hud = new Hud_1.Hud({ eventEmitter: this.eventEmitter });
        worldInfo.npcList.forEach((npc) => {
            if (npc.type === contract_1.NPCTypes.PACIFIC) {
                this.pacificNpcs.push(new PacificNpc_1.PacificNpc({
                    npcName: npc.npcName,
                    pos: npc.pos,
                    sprite: resources_1.Resources[npc.sprite],
                    spriteSize: npc.spriteSize,
                    dialogue: npc.dialogue || [""],
                    collisionType: excalibur_1.CollisionType.Fixed,
                    stats: npc.stats,
                    eventEmitter: this.eventEmitter,
                }));
            }
            else if (npc.type === contract_1.NPCTypes.AGRESSIVE) {
                let npcToPush;
                if (npc.npcName === "Slime") {
                    npcToPush = new Slime_1.Slime({
                        npcName: npc.npcName,
                        pos: npc.pos,
                        spriteSize: npc.spriteSize,
                        sprite: resources_1.Resources[npc.sprite],
                        collisionType: excalibur_1.CollisionType.Active,
                        stats: npc.stats,
                        rewards: npc.rewards || { exp: 0 },
                        eventEmitter: this.eventEmitter,
                    });
                    this.agressiveNpcs.push(npcToPush);
                }
            }
        });
    }
    onInitialize(engine) {
        engine.start(resources_1.worldLoader).then(() => {
            resources_1.Resources.Level1Map.addToScene(this);
        });
    }
    onActivate() {
        this.loadPlayer();
        this.loadNpcs();
        this.loadHUD();
    }
    loadPlayer() {
        this.player = new Player_1.Player(this._playerInfo.position, this._playerInfo.nickname, this._playerInfo.progress, this._playerInfo.stats, this.eventEmitter);
        this.player.z = this._playerInfo.zIndex;
        this.add(this.player);
        this.camera.strategy.lockToActor(this.player);
        this.camera.zoom = 2.3;
    }
    loadNpcs() {
        this.pacificNpcs.forEach((npc) => {
            this.add(npc);
        });
        this.agressiveNpcs.forEach((npc) => {
            this.add(npc);
        });
    }
    loadHUD() {
        if (this.player) {
            this.hud.updatePlayerInfoHud(this.player);
            this.hud.show();
        }
    }
}
exports.Level = Level;
