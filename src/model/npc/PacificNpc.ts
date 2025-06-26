import { AnimationStrategy, CollisionGroupManager, CollisionType, Graphic, GraphicsGroup, range, SpriteSheet, Vector, Animation } from "excalibur";
import { Npc } from "./Npc";
import { PacificNpcType } from "./contract";
import { GamePlayerEvents } from "state/helpers/PlayerEvents";
import { EventManager } from "model/EventManager/EventManager";
import { AnimationDirection } from "model/ExtendedActor/contract";

const npcGroupMask = CollisionGroupManager.create('npcGroup')

export class PacificNpc extends Npc {
    private rangeOfInteraction: number = 25;
    constructor({ name, pos, sprite, spriteSize, events, stats, currentHealth, maxHealth, eventEmitter}: PacificNpcType) {
        super({
          name,
          pos,
          sprite,
          spriteSize,
          collisionType: CollisionType.Fixed,
          collisionGroup: npcGroupMask,
          stats,
          currentHealth,
          maxHealth,
          events,
          eventEmitter,
        });
    }

    onInitialize(): void {
      super.onInitialize();
      this.eventEmitter.on(GamePlayerEvents.PLAYER_NPC_INTERACTION_START, 
        ({pos, direction}:{pos:Vector, direction: AnimationDirection}) => {
          this.handlePlayerInteraction(pos, direction);
        }
      );
    }

    handlePlayerInteraction(pos: Vector, direction: AnimationDirection) {
      console.log(this.name + "is interacting with player");
      const diffOfPositions = this.pos.sub(pos);
      if(diffOfPositions.distance() > this.rangeOfInteraction) {
        return null;
      }
      if(this.hasDirectInteraction(pos, direction) && this.eventMap?.length > 0) {
        EventManager.eventMap = this.eventMap;
        EventManager.run();
      }
    }

    
}