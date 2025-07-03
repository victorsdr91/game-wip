import { Engine, Entity, Query, System, SystemType, World } from "excalibur";
import { ExtendedActor } from "model/ExtendedActor/ExtendedActor";
import { Npc } from "model/Npc/Npc";
import HealthComponent from "services/systems/Health/components/HealthComponent";
import { MovementComponent } from "../Movement/components/MovementComponent";
import { TauntComponent } from "../Combat/components/TauntComponent";

export class HealthSystem extends System {
    query: Query<typeof HealthComponent>;
    systemType: SystemType = SystemType.Update;
    priority = 92;
    engine: Engine;
    elapsedTime: Map<Entity, number> = new Map();

    constructor(world: World) {
        super();
        this.query = world.query([HealthComponent]);
        this.engine = world.scene.engine;
    }

    update(elapsed: number): void {
        for(const entity of this.query.entities) {
            this.elapsedTime.set(entity, (this.elapsedTime.get(entity) || 0) + elapsed);
            this.checkDeadEntity(entity);
            if(entity instanceof Npc) {
                const healthComponent = entity.get(HealthComponent);
                const movementComponent = entity.get(MovementComponent);
                const tauntedComponent = entity.get(TauntComponent);
                if(movementComponent && entity.pos.equals(movementComponent.originalPosition, 0.01) && !tauntedComponent?.isTaunted && healthComponent.health < healthComponent.maxHealth) {
                    const entityElapsedTime = this.elapsedTime.get(entity) || 0;
                    if(entityElapsedTime > 1000) { // Regenerate health every second
                        this.elapsedTime.set(entity, 0);
                        healthComponent.health += Math.round(healthComponent.maxHealth/10);
                    }
                     // Regenerate health over time
                }
            }
        }
    }

    checkDeadEntity(entity: Entity<HealthComponent>): void {
        const healthComponent = entity.get(HealthComponent);
        if (healthComponent && entity instanceof ExtendedActor) {
            if (!healthComponent.isAlive()) {
                //Execute animation of death
            }
        }
    }


}