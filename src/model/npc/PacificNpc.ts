import { Npc } from "./Npc";

export class PacificNpc extends Npc {
    private dialogue: Array<string>;

    constructor({ npcName, pos, health, sprite, dialogue }) {
        super({
          npcName,
          pos,
          health,
          sprite
        });
        this.dialogue = dialogue;
    }
}