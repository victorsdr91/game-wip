"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgressiveNpc = exports.EnemiesCollisionGroup = void 0;
const excalibur_1 = require("excalibur");
const Npc_1 = require("./Npc");
exports.EnemiesCollisionGroup = excalibur_1.CollisionGroupManager.create('enemies');
class AgressiveNpc extends Npc_1.Npc {
    constructor({ npcName, pos, sprite, spriteSize, stats, rewards, collisionType, eventEmitter }) {
        super({
            npcName,
            pos,
            sprite,
            spriteSize,
            stats,
            collisionType,
            collisionGroup: exports.EnemiesCollisionGroup,
            eventEmitter,
        });
        this.attacking = false;
        this.taunted = false;
        this.rewards = rewards;
        eventEmitter.on('player-health-depleted', () => {
            this.taunted = false;
            this.returnToOriginalPosition();
            this.passiveHeal();
        });
    }
    isTaunted() {
        return this.taunted;
    }
    toggleTaunted() {
        this.taunted = !this.taunted;
    }
    isAttacking() {
        return this.attacking;
    }
    toggleAttacking() {
        this.attacking = !this.attacking;
    }
    passiveHeal() {
        if (!this.isTaunted()) {
            const interval = setInterval(() => {
                if (this.getHealth() >= this.getMaxHealth()) {
                    clearInterval(interval);
                }
                const currentHealth = this.getHealth();
                const pointsToRecover = this.getMaxHealth() * 0.15;
                this.setHealth(currentHealth + pointsToRecover);
                this.hpGraphic.text = `${this.getHealth()}`;
            }, 1000);
        }
    }
    calculateDamage(attacker, defender) {
        const attackerStats = attacker.getStats();
        const defenderStats = defender.getStats();
        const damageDealt = (attackerStats.f_attack * attackerStats.level - defenderStats.f_defense * defenderStats.level);
        return damageDealt > 0 ? damageDealt : 0;
    }
    receiveDamage(damage, actor) {
        const damageReceived = damage - this.stats.f_defense * this.stats.level;
        const totalDamage = damageReceived > 0 ? damageReceived : 0;
        this.setHealth(this.getHealth() - totalDamage);
        this.hpGraphic.text = `${this.getHealth()}`;
        if (!this.isTaunted()) {
            this.taunted = true;
            this.target = actor;
        }
    }
}
exports.AgressiveNpc = AgressiveNpc;
