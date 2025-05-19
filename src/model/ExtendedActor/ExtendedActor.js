"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedActor = void 0;
const excalibur_1 = require("excalibur");
const BASE_HEALTH = 100;
const CON_MULTIPLIER = 0.4;
class ExtendedActor extends excalibur_1.Actor {
    constructor({ pos, width, height, collisionType, collisionGroup, stats, eventEmitter }) {
        super({
            pos,
            width,
            height,
            collisionType,
            collisionGroup,
        });
        this.speed = 16;
        this.playerFrameSpeed = 200; // ms
        this.colliding = false;
        this.stats = stats;
        this.event = eventEmitter;
        this.health = this.getMaxHealth();
        this.originalPosition = pos;
    }
    setHealth(health) {
        const maxHealth = this.getMaxHealth();
        if (health >= maxHealth) {
            this.health = maxHealth;
        }
        else if (health <= 0) {
            this.health = 0;
        }
        else {
            this.health = health;
        }
    }
    getHealth() {
        return this.health;
    }
    getStats() {
        return this.stats;
    }
    getMaxHealth() {
        return BASE_HEALTH + (this.stats.con * CON_MULTIPLIER);
    }
    returnToOriginalPosition() {
        this.actions.moveTo(this.originalPosition, this.speed * this.stats.speed);
    }
}
exports.ExtendedActor = ExtendedActor;
