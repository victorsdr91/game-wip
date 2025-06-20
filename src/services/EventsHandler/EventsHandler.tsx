import { Game } from "services/Game";
import { EventEmitter } from "excalibur";

abstract class EventsHandler {
    protected gameHandler: Game; // UI Communication purposes
    protected levelEventHandler: EventEmitter; // Level communication purposes

    constructor(eventEmitter?: EventEmitter) {
        this.gameHandler = Game.getInstance();
        this.levelEventHandler = eventEmitter || new EventEmitter();
    }

    initialize() {};
}

export default EventsHandler;