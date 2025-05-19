"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacificNpc = void 0;
const excalibur_1 = require("excalibur");
const Npc_1 = require("./Npc");
const npcGroupMask = excalibur_1.CollisionGroupManager.create('npcGroup');
class PacificNpc extends Npc_1.Npc {
    constructor({ npcName, pos, sprite, spriteSize, dialogue, stats, eventEmitter }) {
        super({
            npcName,
            pos,
            sprite,
            spriteSize,
            collisionType: excalibur_1.CollisionType.Fixed,
            collisionGroup: npcGroupMask,
            stats,
            eventEmitter,
        });
        this.dialogue = dialogue;
    }
}
exports.PacificNpc = PacificNpc;
