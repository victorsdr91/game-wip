import { Vector } from "excalibur";
import { playerInfoType } from "scenes/Level1/contract";

const playerItems: Map<number, number> = new Map<number, number>();
playerItems.set(1, 1); // Adding a sword with ID 1 and quantity 1


export const playerInfo: playerInfoType = {
  nickname: "TrianMARC",
  position: new Vector(123, 485),
  zIndex: 8,
  currentHealth: 128,
  maxHealth: 128,
  progress: {
    exp: 0,
    expNextLevel: 100,
  },
  inventory: {
    slots: 32,
    maxWeight: 5000,
    items: playerItems,
  },
  equipment: {
    main_hand: { itemId: 1, quantity: 1 }, // Assuming 1 is the ID for a sword
    bullet: { itemId: 2, quantity: 20 }, // Assuming 2 is the ID for a bullet
  },
  stats: {
    level: 1,
    f_attack: 10,
    f_defense: 12,
    m_attack: 5,
    m_defense: 10,
    speed: 3,
    cSpeed: 2,
    agi: 2,
    con: 20
  }
};