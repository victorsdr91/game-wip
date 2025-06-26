import { EventMap } from "./contract";
import { Event, Condition } from "../Event/contract";
import { EventEmitter, Subscription } from "excalibur";
import { Game } from "services/Game";
import { GameEventType } from "state/helpers/Events";

const START = 'start';
const FINISH = 'finish';

export class EventManager {
    static _currentEventMap: EventMap = [];
    static _eventEmitter: EventEmitter;
    static gameHandler: Game;
    static subscription: Subscription;
    
    constructor() {}

    static async run() {
        this.gameHandler = Game.getInstance();
        this._currentEventMap.forEach((event: Event) => {
            this.start(event).then((e) => {
                if(event.started) {
                    this.active(e);
                }
            });
        });
    }

    static async start(event: Event): Promise<Event> {
        if(this.checkConditions(event.conditions) && !event.active) {
            event.onStart && event.onStart(this._eventEmitter);
            event.started = true;
            this.gameHandler.emit(event.eventId+START, event.message);
        }

        return event;
    }

    static setupEventHandler(event: Event){
        this.subscription = this.gameHandler.on(event.eventId+FINISH, (e: unknown) => {  
            const { finished } = e as { finished: boolean };
            event.finished = finished;
            this.finish(event);
        });
    }

    static async active(event: Event): Promise<Event> {
        if(event.started && !event.active) {
            this.setupEventHandler(event);
            event.onActivate(this._eventEmitter);
            event.active = true;
        }
        return event;
    }
    static finish(event: Event): void {
        event.onFinish && event.onFinish(this._eventEmitter);
        this.subscription.close();
    }

    static set eventMap(eventMap: EventMap) {
        this._currentEventMap = eventMap;
    }

    static set levelEventEmitter(levelEventEmitter: EventEmitter) {
        this._eventEmitter = levelEventEmitter;
    }
       
    static checkConditions(conditions: Condition[]): boolean {
        return !conditions.find((condition) => !condition());
    }
}