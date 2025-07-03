import { Color, Debug, Engine, Query, System, SystemType, Timer, Vector, World } from "excalibur";
import { ExtendedActor } from "model/ExtendedActor/ExtendedActor";
import { Npc } from "model/Npc/Npc";
import { Player } from "model/Player/Player";
import { CombatComponent } from "services/systems/Combat/components/CombatComponent";
import { ExperienceComponent } from "services/systems/common/components/ExperienceComponent";
import HealthComponent from "services/systems/Health/components/HealthComponent";
import { MovementComponent } from "services/systems/Movement/components/MovementComponent";
import StatsComponent from "services/systems/common/components/StatsComponent";
import { TauntComponent } from "services/systems/Combat/components/TauntComponent";
import { MovementDirection, MovementMode } from "services/systems/Movement/types/movement.enum";
import { ActiveSkillType, CurrentSkill, EffectType, SkillType } from "services/systems/Combat/types/skill.type";
import { StatsEnum } from "services/systems/common/components/types/stats.enum";

export class CombatSystem extends System {
    query: Query<typeof CombatComponent>;
    engine: Engine;
    world: World;
    systemType: SystemType = SystemType.Update;
    priority = 91;
    
    constructor(world: World) {
        super();
        this.query = world.query([CombatComponent]);
        this.world = world;
        this.engine = world.scene.engine;
    }
    
    update(elapsed: number): void {
        for(const entity of this.query.entities) {
            const healthComponent = entity.get(HealthComponent);
            if(!healthComponent?.isAlive()) {
                continue; // Skip entities that are not alive
            }
            if(entity instanceof Player) {
                this.handlePlayerCombat(entity, elapsed);
            } else if(entity instanceof Npc) {
                this.handleNpcCombat(entity, elapsed);
            }
        }
    }

    handlePlayerCombat(player: Player, elapsed: number): void {
        const combatComponent = player.get(CombatComponent);
        const currentSkill = combatComponent?.currentSkill;
        const isActiveAttack = currentSkill && combatComponent?.isInCombat;
        if(isActiveAttack && !currentSkill.skill.isInCooldown) {
            if(currentSkill.skill.type === SkillType.Passive || currentSkill.skill.activeType?.includes(ActiveSkillType.Support)) {
                return; //selected skill is passive or support, skip entity
            }
            currentSkill.pos = player.pos;
            this.managePlayerSkill(player, currentSkill);
            const skillArea = combatComponent.getSkillArea(currentSkill);
            Debug.drawPolygon(skillArea, { color: Color.Yellow });
            if(currentSkill.isExecuted) {
                const targets = this.searchTargets(player, skillArea);
                if (targets.length === 0) {
                    return;
                }
                
                targets.forEach(target => {
                    this.handleCombat(currentSkill, player, target, elapsed);
                });
                this.cooldownSkill(currentSkill, elapsed); // Start cooldown for the skill
                combatComponent.isInCombat = false; // Reset combat state after handling
            }
        }
    }

    handleNpcCombat(npc: Npc, elapsed: number): void {
        const combatComponent = npc.get(CombatComponent);
        const tauntComponent = npc.get(TauntComponent);
        
        if(combatComponent && tauntComponent) {
            const isTaunted = tauntComponent.isTaunted;
            const target = tauntComponent.getTauntedTarget();

            if(!combatComponent.isInCombat && isTaunted) {
                combatComponent.isInCombat = true; // Set combat state to true if taunted   
            }

            if(target && combatComponent.isInCombat) {
                const skillToUse = combatComponent.skills[0]; // Default to the first skill, in the future we need to give weight to skills to be used by npcs
                combatComponent.currentSkill = { skill: skillToUse, isExecuted: false, pos: npc.pos }; // Ensure current skill is set
                const currentSkill = combatComponent.currentSkill;
                if(currentSkill?.skill.type === SkillType.Passive || currentSkill?.skill.activeType?.includes(ActiveSkillType.Support)) {
                    return; //selected skill is passive or support, skip entity
                }

                const distanceToTarget = npc.pos.distance(target.pos || Vector.Zero) - target.width/3; // Calculate distance to target
                if(distanceToTarget > currentSkill?.skill?.range*5) {
                    combatComponent.isInCombat = false; // Reset combat state if target is too far
                    tauntComponent.removeTarget(target); // Remove target if too far
                    tauntComponent.resetTaunt(); // Reset taunt state
                    this.moveToOriginalPosition(npc, elapsed); // Move NPC to original position
                    return; // Exit if the target is too far away
                }
                
                const isInRange = distanceToTarget <= currentSkill?.skill?.range || false;
                if(isInRange) {
                    this.executeNpcSkill(npc, currentSkill, target, elapsed); // Execute the skill if in range
                } else {
                    this.followTarget(npc, target); // Follow the target if not in range
                }

            }
        }            
    }

    moveToOriginalPosition(entity: ExtendedActor, elapsed: number): void {
        const movementComponent = entity.get(MovementComponent);
        if(movementComponent) {
            entity.actions.moveTo(movementComponent.originalPosition, (movementComponent.baseSpeed*2)/elapsed); // Move to original position
        }
    }

    followTarget(npc: Npc, target: ExtendedActor): void {
        const statsComponent = npc.get(StatsComponent);
        const movementComponent = npc.get(MovementComponent);
        if(movementComponent && statsComponent) {
            // Move towards the target if not in range
            const direction = target.pos.sub(npc.pos).normalize();
            movementComponent.mode = MovementMode.WALK;
            movementComponent.speed = movementComponent.baseSpeed * statsComponent.getStat(StatsEnum.speed);
            const { x, y } = direction
            movementComponent.direction = x > 0 ? MovementDirection.RIGHT : MovementDirection.LEFT;
            if(Math.abs(y) > Math.abs(x)) {
                movementComponent.direction = y > 0 ? MovementDirection.DOWN : MovementDirection.UP;
            }
        }
    }

    executeNpcSkill(npc: Npc, currentSkill: CurrentSkill, target: ExtendedActor, elapsed: number): void {
        const combatComponent = npc.get(CombatComponent);
        currentSkill.direction = target.pos.sub(npc.pos).toAngle();
        const skillArea = combatComponent.getSkillArea(currentSkill);
        Debug.drawPolygon(skillArea, { color: Color.Yellow });

        if(!currentSkill.skill.isInCooldown) {
            currentSkill.isExecuted = true; // Mark the skill as executed
        }
        
        if(currentSkill.isExecuted) {
            const targets = this.searchTargets(npc, skillArea);
            if (targets.length === 0) {
                return;
            }
            
            targets.forEach(target => {
                this.handleCombat(currentSkill, npc, target, elapsed);
            });
            this.cooldownSkill(currentSkill, elapsed); // Start cooldown for the skill
            combatComponent.isInCombat = false; // Reset combat state after handling
            currentSkill.isExecuted = false; // Reset the skill execution state
        }
    }

    private cooldownSkill(executedSkill: CurrentSkill, elapsed: number): void {
        executedSkill.skill.isInCooldown = true; // Set the skill to cooldown state
        const cooldownTimer = new Timer({
            fcn: () => { executedSkill.skill.isInCooldown = false; },
            repeats: false,
            interval: executedSkill.skill.cooldown * 1000 + elapsed // Convert seconds to milliseconds
        });
        this.engine.add(cooldownTimer);
        cooldownTimer.start();
    }

    private managePlayerSkill(player: Player, skill: CurrentSkill) {
         if(skill.skill.origin === "mouse") {
            skill.pos = this.engine.input.pointers.primary.lastWorldPos; // Update the position
        }
        skill.direction = this.engine.input.pointers.primary.lastWorldPos.sub(player.pos).toAngle(); // Update the direction based on the current pointer position
        Debug.drawPoint(this.engine.input.pointers.primary.lastWorldPos, {
            color: Color.Red,
            size: 2
        });
    }

    searchTargets(entity: ExtendedActor, area:Vector[]): ExtendedActor[] {
        // This method should return a list of targets based on the entity's combat component
        const combatComponent = entity.get(CombatComponent);
        const skill = combatComponent.currentSkill;
        if (!combatComponent || !skill) {
            return [];
        }
        
        const targets: ExtendedActor[] = [];
        for (const target of this.query.entities) {
            if (target instanceof ExtendedActor && target !== entity && target._group !== entity._group && area.some(area => area.distance(target.pos) <= skill.skill.range)) {
                targets.push(target);
            }
        }
        return targets;
    }

    
    private handleCombat(currentSkill: CurrentSkill, from: ExtendedActor, target: ExtendedActor, elapsed: number): void {
        const damageType = currentSkill?.skill?.activeType || ActiveSkillType.Physical; // Default to physical if not specified
        const damageEffect = currentSkill.skill.effects?.find(effect => effect.effectType === EffectType.Damage);
        const attackPower = damageEffect?.value || 0;
        const damageDone = this.receiveDamage(target, damageType, attackPower);

        const tauntComponent = target.get(TauntComponent);
        if(tauntComponent) {
            const tauntMultiplier = damageEffect?.tauntMultiplier || 1; // Default to 1 if not specified
            const tauntLevel = tauntComponent.tauntLevelBase*damageDone*tauntMultiplier;
            tauntComponent.tauntedBy(from, tauntLevel); // Taunt the target
        }
    }

    private receiveDamage (target: ExtendedActor, damageType: ActiveSkillType, damageQuantity: number ): number {
        const healthComponent = target.get(HealthComponent);
        const statsComponent = target.get(StatsComponent);
        const { level } = target.get(ExperienceComponent);

        if (!healthComponent?.isAlive()) {
            return healthComponent.health; // No damage if the target is already dead
        }

        const defense = statsComponent.getStat(damageType === ActiveSkillType.Physical ? StatsEnum.f_defense : StatsEnum.m_defense);
        const damageReceived = damageQuantity - defense*level*0.5;
        const totalDamage = damageReceived > 0 ? damageReceived : 0;
        healthComponent.health -= totalDamage;

        if(target instanceof Player) {
            target.updateHud(); // Update the player's HUD if the target is a player
        }

        return totalDamage;
    }
}