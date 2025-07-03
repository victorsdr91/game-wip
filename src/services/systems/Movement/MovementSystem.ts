import { Entity, Query, System, SystemType, Vector, World } from "excalibur";
import { ExtendedActor } from "model/ExtendedActor/ExtendedActor";
import HealthComponent from "services/systems/Health/components/HealthComponent";
import { MovementComponent } from "services/systems/Movement/components/MovementComponent";
import { MovementDirection, MovementMode } from "services/systems/Movement/types/movement.enum";

export class MovementSystem extends System {
    query: Query<typeof MovementComponent>;
    systemType: SystemType = SystemType.Update;
    priority = 90;

    constructor(world: World) {
        super();
        this.query = world.query([MovementComponent]);
    }

    update(elapsed: number): void {
        for(const entity of this.query.entities) {
            if(entity instanceof ExtendedActor) {
                this.move(entity, elapsed);
            }
        }
    }

    protected move(entity: Entity<MovementComponent>, elapsed: number): void {
        const movementComponent = entity.get(MovementComponent);
        const healthComponent = entity.get(HealthComponent);
        if(entity instanceof ExtendedActor && healthComponent?.isAlive()) {
            entity.vel = Vector.Zero;
            const mode = movementComponent.mode;
            if(mode === MovementMode.IDLE) {
                return;
            }
            const speed = mode === MovementMode.RUN ? movementComponent.speed*2 : movementComponent.speed;
            
            entity.vel = this.calculateMovementVelocity(movementComponent.direction, speed/elapsed);
        }
        movementComponent.resetMovement();
    }

    private calculateMovementVelocity(direction: MovementDirection, speed: number): Vector {
        switch(direction) {
            case MovementDirection.LEFT:
                return new Vector(-speed, 0);
            case MovementDirection.RIGHT:
                return new Vector(speed, 0);
            case MovementDirection.UP:
                return new Vector(0, -speed);
            case MovementDirection.DOWN:
                return new Vector(0, speed);
            default:
                return Vector.Zero;
        }
    }
}