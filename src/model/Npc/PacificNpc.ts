import { CollisionGroupManager } from "excalibur";


export class PacificNpc {
    private rangeOfInteraction: number = 25;
    constructor({ name, pos, sprite, spriteSize, events, stats, currentHealth, maxHealth}) {
        
    }

    // To be handled by EventSystem
    // onInitialize(): void {
    //   this.on(GamePlayerEvents.PLAYER_NPC_INTERACTION_START, 
    //     (event: unknown) => {
    //       const { pos, direction } = event as { pos: Vector, direction: MovementDirection };
    //       this.handlePlayerInteraction(pos, direction);
    //     }
    //   );
    // }

    // handlePlayerInteraction(pos: Vector, direction: MovementDirection) {
    //   console.log(this.name + "is interacting with player");
    //   const diffOfPositions = this.pos.sub(pos);
    //   if(diffOfPositions.distance() > this.rangeOfInteraction) {
    //     return null;
    //   }
    //   if(this.hasDirectInteraction(pos, direction) && this.eventMap?.length > 0) {
    //     EventManager.eventMap = this.eventMap;
    //     EventManager.run();
    //   }
    // }

    
}