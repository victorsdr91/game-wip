"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slime = void 0;
const excalibur_1 = require("excalibur");
const AgressiveNpc_1 = require("./AgressiveNpc");
class Slime extends AgressiveNpc_1.AgressiveNpc {
    constructor({ npcName, pos, sprite, spriteSize, collisionType, stats, rewards, eventEmitter }) {
        super({
            npcName,
            pos,
            sprite,
            spriteSize,
            stats,
            rewards,
            collisionType,
            eventEmitter
        });
    }
    onInitialize() {
        var _a;
        let animationMode = "idle";
        if (this.isAttacking()) {
            animationMode = "attack";
        }
        const spriteSheet = excalibur_1.SpriteSheet.fromImageSource({
            image: this.sprite,
            grid: {
                rows: 3,
                columns: 8,
                spriteWidth: 64,
                spriteHeight: 64,
            },
            spacing: {
                originOffset: {
                    x: 0, y: 0
                },
                // Optionally specify the margin between each sprite
                margin: { x: 0, y: 0 }
            }
        });
        this.animations = {
            idle: {
                up: spriteSheet.getSprite(0, 0),
                down: excalibur_1.Animation.fromSpriteSheet(spriteSheet, (0, excalibur_1.range)(0, 3), 210),
                left: spriteSheet.getSprite(0, 2),
                right: spriteSheet.getSprite(0, 1)
            },
            attack: {
                up: spriteSheet.getSprite(0, 0),
                down: excalibur_1.Animation.fromSpriteSheet(spriteSheet, (0, excalibur_1.range)(8, 15), 210),
                left: spriteSheet.getSprite(0, 2),
                right: spriteSheet.getSprite(0, 1)
            },
            die: excalibur_1.Animation.fromSpriteSheet(spriteSheet, (0, excalibur_1.range)(16, 23), 210, excalibur_1.AnimationStrategy.Freeze),
        };
        this.z = 99;
        this.graphics.add("idle-down", this.animations.idle.down);
        this.animations.die && this.graphics.add("die", this.animations.die);
        this.animations.die.events.on("end", () => {
            this.event.emit("npc-aggresive-died", { rewards: this.rewards, actor: this.target });
            this.actions.clearActions();
            setTimeout(() => { this.kill(); }, 1000 * 10);
        });
        ((_a = this.animations.attack) === null || _a === void 0 ? void 0 : _a.down).events.on("loop", () => { this.handleAttack(); });
        this.animations.attack && this.graphics.add("attack-down", this.animations.attack.down);
        this.handleEvents();
    }
    useGraphic(graphic) {
        const graphicsGroup = new excalibur_1.GraphicsGroup({
            useAnchor: false,
            members: [
                {
                    graphic: graphic,
                    offset: new excalibur_1.Vector(-32, -32),
                },
                {
                    graphic: this.npcName,
                    offset: new excalibur_1.Vector(0, -20),
                },
                {
                    graphic: this.hpGraphic,
                    offset: new excalibur_1.Vector(0, -27),
                },
            ]
        });
        graphicsGroup.width = 32;
        this.graphics.use(graphicsGroup);
    }
    handleEvents() {
        this.handlePlayerAttackEvent();
    }
    handlePlayerAttackEvent() {
        this.event.on("player-attack-basic", ({ pos, range, direction, damage, actor }) => {
            let diff = this.pos.sub(pos);
            if (diff.distance() > range) {
                return;
            }
            const attackFromRight = pos.x < this.pos.x && direction === "right";
            const attackFromLeft = pos.x > this.pos.x && direction === "left";
            const attackFromTop = pos.y > this.pos.y && direction === "up";
            const attackFromBottom = pos.y < this.pos.y && direction === "down";
            if (attackFromRight || attackFromLeft || attackFromBottom || attackFromTop) {
                this.receiveDamage(damage, actor);
            }
        });
    }
    handleAttack() {
        const eventData = {
            actor: this,
            pos: this.pos,
            damage: this.stats.f_attack * this.stats.level,
        };
        this.event.emit("npc-attack-basic", eventData);
        this.attacking = false;
    }
    onPreUpdate(engine, elapsedMs) {
        var _a;
        if (this.getHealth() > 0) {
            this.useGraphic(this.graphics.use("idle-down"));
            this.attacking = false;
            if (this.isTaunted()) {
                const distanceFromTarget = this.pos.distance((_a = this.target) === null || _a === void 0 ? void 0 : _a.pos);
                this.actions.clearActions();
                if (distanceFromTarget <= 20 && !this.isAttacking()) {
                    this.attacking = true;
                    this.useGraphic(this.graphics.use("attack-down"));
                }
                else if (distanceFromTarget > 20 && distanceFromTarget < 80 && this.target) {
                    this.actions.meet(this.target, this.speed * this.stats.speed);
                }
                else if (distanceFromTarget > 80) {
                    this.taunted = false;
                    this.returnToOriginalPosition();
                    this.passiveHeal();
                }
            }
        }
        else {
            this.useGraphic(this.graphics.use("die"));
        }
    }
}
exports.Slime = Slime;
