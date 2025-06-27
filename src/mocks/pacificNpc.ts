import { PacificNpcType } from "scenes/Test/contract";
import { spriteSize } from "scenes/Test/contract";
import { PacificNpcEventMap } from "./events";

export const pacificNpcMock: PacificNpcType = {
    name: "NPC TEST",
    pos: { x:27 , y:373, z: 10 },
    currentHealth: 128,
    maxHealth: 128,
    sprite: "monster_001",
    spriteSize: {
        width: spriteSize.small,
        height: spriteSize.small
    },
    stats: {
        level: 2,
        f_attack: 2,
        f_defense: 2,
        m_attack: 2,
        m_defense: 2,
        speed: 3,
        cSpeed: 2,
        agi: 2,
        con: 2,
        f_damage: 10,
        m_damage: 10,
        critical_rate: 2,
    },
    events: PacificNpcEventMap,
};