import { loader } from "./resources";
import { NpcInterface, spriteSize, worldInfoType } from "./scenes/Test/contract";
import { calculateExPixelConversion } from "./ui/utils/pixelRatioUtils";
import { playerInfo } from "./mocks/player";
import { Game } from "services/Game";
import { pacificNpcMock } from "./mocks/pacificNpc";
import { basicSlimeSkill } from "./mocks/skills";
import { NpcType } from "model/Npc/contract";

const generateMonster = (x: number, y: number): NpcInterface => {
  return { 
    name: "Slime",
    type: NpcType.ENEMY,
    pos: {x, y, z: 9},
    health: {
      total: 128
    },
    sprite: "monster_001",
    spriteSize: {
      width: spriteSize.small,
      height: spriteSize.small
    },
    rewards: {
      exp: 100,
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
    skills: [ basicSlimeSkill ],
  };
};




const Npcs =new Array<NpcInterface>();

for(let i = 0; i < 5; i++) {
  Npcs.push(generateMonster(
    491+Math.random()*132,
    203+Math.random()*258
  ));
}
Npcs.push(pacificNpcMock);

const worldInfo: worldInfoType = {
  playerInfo,
  Npcs
};

export const game = Game.getInstance();

game.screen.events.on('resize', () => calculateExPixelConversion(game.screen));
game.showDebug(true);

game.start(loader).then(() => {
  calculateExPixelConversion(game.screen);
  game.setWorld(worldInfo);
  game.setUpGame().catch(error => {
    console.error("Failed to setup game:", error);
  });
});