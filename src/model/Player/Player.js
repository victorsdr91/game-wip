"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.PlayerCollisionGroup = void 0;
const excalibur_1 = require("excalibur");
const Config_1 = require("../../state/Config");
const ExtendedActor_1 = require("../ExtendedActor/ExtendedActor");
const PlayerAnimations_1 = require("./PlayerAnimations");
const contract_1 = require("./contract");
exports.PlayerCollisionGroup = excalibur_1.CollisionGroupManager.create('player');
class Player extends ExtendedActor_1.ExtendedActor {
    constructor(pos, nickname, progress, stats, eventEmitter) {
        super({
            pos: pos,
            width: 16,
            height: 16,
            collisionType: excalibur_1.CollisionType.Active,
            collisionGroup: exports.PlayerCollisionGroup,
            stats,
            eventEmitter,
        });
        this.direction = contract_1.animationDirection.DOWN;
        this.movementMode = contract_1.animationMode.IDLE;
        this.isAttacking = false;
        this.controlMap = {};
        this.attackMode = 0;
        this.playerDead = false;
        this.resetPlayer = () => {
            this.pos = this.originalPosition;
            this.playerDead = false;
            this.direction = contract_1.animationDirection.DOWN;
            this.updateHealth(this.getMaxHealth());
        };
        this.nickname = new excalibur_1.Text({ text: nickname, font: new excalibur_1.Font({ size: 8, color: excalibur_1.Color.White, textAlign: excalibur_1.TextAlign.Center }) });
        this.progress = progress;
        this.playerAnimation = new PlayerAnimations_1.PlayerAnimation(this.playerFrameSpeed);
        const actionsMap = {
            "movement": {
                "left": () => { this.move(contract_1.animationDirection.LEFT, contract_1.animationMode.WALK); },
                "right": () => { this.move(contract_1.animationDirection.RIGHT, contract_1.animationMode.WALK); },
                "up": () => { this.move(contract_1.animationDirection.UP, contract_1.animationMode.WALK); },
                "down": () => { this.move(contract_1.animationDirection.DOWN, contract_1.animationMode.WALK); },
                "run": () => { this.run(); },
            },
            "skills": {
                "first": () => { this.isAttacking = true; }
            }
        };
        const controls = Config_1.Config.getControls().keyboard;
        Object.keys(controls)
            .forEach((type) => {
            Object.keys(controls[type])
                .forEach((key) => {
                this.controlMap[controls[type][key]] = actionsMap[type][key];
            });
        });
        this.handleEvents();
    }
    handleEvents() {
        this.handleNpcBasicAttack();
        this.handleMonsterRewards();
    }
    handleNpcBasicAttack() {
        this.event.on("npc-attack-basic", ({ pos, range, damage, actor }) => {
            let diff = this.pos.sub(pos);
            if (diff.distance() > range) {
                return;
            }
            this.receiveDamage(damage, actor);
        });
    }
    handleMonsterRewards() {
        this.event.on("npc-aggresive-died", ({ actor, rewards }) => {
            if (this.nickname.text === actor.nickname.text) {
                if (rewards.exp) {
                    this.progress.exp += rewards.exp;
                    console.log(`${this.nickname.text} has received ${rewards.exp} experience points`);
                    this.isLvlUp(this.progress.exp) && this.lvlUp();
                }
            }
        });
    }
    isLvlUp(exp) {
        return exp >= this.progress.expNextLevel;
    }
    lvlUp() {
        this.stats.level++;
        const diffExp = this.progress.exp - this.progress.expNextLevel;
        this.progress.exp = diffExp;
        this.progress.expNextLevel += (this.progress.expNextLevel * 1.5) + 50;
        this.event.emit('player-lvl-update', { newLvl: this.stats.level });
    }
    onInitialize() {
        this.playerAnimation.initialize();
        const attacks = this.playerAnimation.getAttackAnimations();
        Object.values(attacks).forEach((attackDirection) => {
            attackDirection.forEach((attack) => {
                attack.events.on("loop", () => {
                    this.isAttacking = false;
                    this.playerBasicAttack();
                });
            });
        });
        const dieAnimation = this.playerAnimation.useDieAnimation();
        dieAnimation.events.on('end', () => {
            setTimeout(() => {
                this.event.emit('player-health-depleted', { callback: this.resetPlayer });
            }, 1500);
        });
    }
    playerBasicAttack() {
        if (++this.attackMode > 2) {
            this.attackMode = 0;
        }
        const eventData = {
            actor: this,
            pos: this.pos,
            direction: this.direction,
            range: 20,
            damage: this.stats.f_attack * this.stats.level,
        };
        this.event.emit("player-attack-basic", eventData);
    }
    move(direction, mode) {
        this.movementMode = this.movementMode !== contract_1.animationMode.RUN ? mode : this.movementMode;
        this.direction = direction;
        const isXMovement = this.direction === contract_1.animationDirection.RIGHT || this.direction === contract_1.animationDirection.LEFT;
        let x = 0;
        let y = 0;
        if (isXMovement) {
            x = direction === contract_1.animationDirection.RIGHT ? this.playerSpeed : -this.playerSpeed;
        }
        else {
            y = direction === contract_1.animationDirection.DOWN ? this.playerSpeed : -this.playerSpeed;
        }
        this.vel = (0, excalibur_1.vec)(x, y);
    }
    run() {
        this.playerSpeed = this.speed * this.stats.speed * 2;
        this.movementMode = contract_1.animationMode.RUN;
    }
    onPreUpdate(engine, elapsedMs) {
        this.vel = excalibur_1.Vector.Zero;
        this.playerSpeed = this.speed * this.stats.speed;
        this.movementMode = contract_1.animationMode.IDLE;
        Object.values(excalibur_1.Keys)
            .filter((key) => engine.input.keyboard.isHeld(key))
            .forEach((key) => {
            this.controlMap[key] && this.controlMap[key]();
        });
        let animationGraphic = this.playerGraphic(this.playerAnimation.usePlayerAnimation({ mode: this.movementMode, direction: this.direction }));
        if (this.isAttacking) {
            animationGraphic = this.playerGraphic(this.playerAnimation.useAttackAnimation(this.direction, this.attackMode || 0));
        }
        else if (this.playerDead) {
            animationGraphic = this.playerGraphic(this.playerAnimation.useDieAnimation());
        }
        this.graphics.use(animationGraphic);
    }
    playerGraphic(animation) {
        const graphicsGroup = new excalibur_1.GraphicsGroup({
            useAnchor: true,
            members: [
                {
                    graphic: animation,
                    offset: new excalibur_1.Vector(0, 8),
                },
                {
                    graphic: this.nickname,
                    offset: new excalibur_1.Vector(16, -4),
                },
            ]
        });
        graphicsGroup.width = 32;
        return graphicsGroup;
    }
    receiveDamage(damage, actor) {
        const damageReceived = damage - this.stats.f_defense * this.stats.level;
        const totalDamage = damageReceived > 0 ? damageReceived : 0;
        this.updateHealth(this.getHealth() - totalDamage);
        if (this.getHealth() <= 0) {
            this.die();
        }
    }
    updateHealth(health) {
        this.setHealth(health);
        this.event.emit('player-health-update', { health });
    }
    die() {
        this.playerDead = true;
    }
}
exports.Player = Player;
