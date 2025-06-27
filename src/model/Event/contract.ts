import { ImageSource, EventEmitter } from "excalibur";
import { GameEventType } from "state/helpers/Events";

export type Condition = () => boolean;

export interface Event {
    eventId: GameEventType;
    message: {};
    started: boolean;
    finished: boolean;
    active: boolean;
    conditions: Condition[];
    onStart?: (levelEventEmitter: EventEmitter) => void;
    onActivate: (levelEventEmitter: EventEmitter) => void;
    onFinish?: (levelEventEmitter: EventEmitter) => void;
}

export interface DialogueEventProps {
    texts: DialogueTexts;
    conditions?: Condition[];
}

export interface Conversation {
    actor: string;
    texts: string[];
    portrait?: ImageSource;
}

export type DialogueTexts = Conversation[];