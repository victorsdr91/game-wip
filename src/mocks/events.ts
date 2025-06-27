import DialogueEvent from "model/Event/DialogueEvent";
import { EventMap } from "model/EventManager/contract";
import { ActorPortraitsResources } from "../resources";

export const npcDialogueTexts = [
    {
        actor: "Actor 1",
        portrait: ActorPortraitsResources['actor1'],
        texts: [
        "Hola, como estás <span style='color:aqua'>Actor 2</span>, sin color", "Que tal?, vamos a meter un texto de mas de dos lineas, a ver como queda, no quiero que se vea feo. Espero que no pase. Se verá bonito? yo creo que es demasiado texto."
        ],
    },
    {
        actor: "Actor 2",
        portrait: ActorPortraitsResources['actor2'],
        texts: [
        "Muy bien, y tu?"
        ],
    },
    {
        actor: "Actor 1",
        portrait: ActorPortraitsResources['actor1'],
        texts: [
        "Bien gracias"
        ],
    },
    {
        actor: "Actor 3",
        portrait: ActorPortraitsResources['actor2'],
        texts: [
        "Que hacemos aqui?"
        ],
    },
];

const npcDialogueEvent = new DialogueEvent({ texts: npcDialogueTexts });

export const PacificNpcEventMap: EventMap = [ npcDialogueEvent ];