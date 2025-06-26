import { Event as EventIface, Condition } from "./contract";
import { EventEmitter, GameEvent } from "excalibur";
import { GameEventType } from "state/helpers/Events";


abstract class Event implements EventIface {
    eventId: GameEventType;
    message: object;
    started: boolean;
    finished: boolean;
    active: boolean;
    conditions: Condition[];

    constructor(eventId: GameEventType, conditions?: Condition[]) {
        this.started = false;
        this.finished = false;
        this.active = false;
        this.conditions = conditions || [];
        this.eventId = eventId;
        this.message = {};

    }

    onActivate(levelEventEmitter: EventEmitter) {
        this.active = true;
    };

     onFinish(){
        setTimeout(() => {
            this.active = false;
            this.started = false;
        }, 500);
    }

}

export default Event;