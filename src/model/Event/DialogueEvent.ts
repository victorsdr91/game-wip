import { EventEmitter, Subscription } from "excalibur";
import { DialogueEventProps, DialogueTexts } from "./contract";
import Event from "./Event";
import { GameEventType } from "state/helpers/Events";

class DialogueEvent extends Event{
    constructor({texts, conditions}: DialogueEventProps) {
        super(GameEventType.EVENT_DIALOGUE, conditions);
        this.message = { texts };
    }
}

export default DialogueEvent;