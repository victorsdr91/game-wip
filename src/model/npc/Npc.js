"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Npc = void 0;
const excalibur_1 = require("excalibur");
const ExtendedActor_1 = require("../ExtendedActor/ExtendedActor");
class Npc extends ExtendedActor_1.ExtendedActor {
    constructor({ npcName, pos, sprite, spriteSize, collisionType, collisionGroup, stats, eventEmitter }) {
        super({
            pos: new excalibur_1.Vector(pos.x, pos.y),
            width: spriteSize.width,
            height: spriteSize.height,
            collisionType,
            collisionGroup,
            stats,
            eventEmitter
        });
        this.z = pos.z || 9;
        this.npcName = new excalibur_1.Text({ text: `lvl ${stats.level} ${npcName}`, font: new excalibur_1.Font({ size: 8, color: excalibur_1.Color.White, textAlign: excalibur_1.TextAlign.Center }) });
        this.hpGraphic = new excalibur_1.Text({ text: `${this.getHealth()}`, font: new excalibur_1.Font({ size: 8, color: excalibur_1.Color.Green, textAlign: excalibur_1.TextAlign.Center }) });
        this.sprite = sprite;
        this.spriteSize = spriteSize;
    }
    onInitialize() {
        const spriteSheet = excalibur_1.SpriteSheet.fromImageSource({
            image: this.sprite,
            grid: {
                rows: 4,
                columns: 3,
                spriteWidth: this.spriteSize.width,
                spriteHeight: this.spriteSize.height,
            },
        });
        this.animations = {
            idle: {
                up: spriteSheet.getSprite(0, 0),
                down: spriteSheet.getSprite(0, 1),
                left: spriteSheet.getSprite(0, 2),
                right: spriteSheet.getSprite(0, 3)
            },
        };
        this.z = 99;
        this.graphics.add("idle-down", this.animations.idle.down);
        const graphicsGroup = new excalibur_1.GraphicsGroup({
            useAnchor: true,
            members: [
                {
                    graphic: this.animations.idle.down,
                    offset: new excalibur_1.Vector(10, 5),
                },
                {
                    graphic: this.npcName,
                    offset: new excalibur_1.Vector(32, -4),
                },
            ]
        });
        graphicsGroup.width = 32;
        this.graphics.use(graphicsGroup);
    }
}
exports.Npc = Npc;
