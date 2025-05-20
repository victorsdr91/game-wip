import { DisplayMode, Engine, Vector } from "excalibur";
import { loader } from "./resources";
import { Level } from "./scenes/Level1/Level";
import { MainMenu } from "./scenes/MainMenu/MainMenu";
import { npcType, NPCTypes, playerInfoType, spriteSize, worldInfoType } from "./scenes/Level1/contract";
import { configType } from "./contract";
import { default as keyboardConfig} from '../public/config/keyboard.json';
import { Config } from "./state/Config";
import { calculateExPixelConversion } from "./ui/utils/calculateExPixelConversion";

class Game extends Engine {
  private worldInfo: worldInfoType;
  private config: configType;

  constructor(worldInfo: worldInfoType, config: configType) {
    super({
      width: 1366,
      height: 768,
      pixelArt: true,
      displayMode: DisplayMode.FitScreen
    });
    this.worldInfo = worldInfo;
    this.config = config;
  }

  initialize()  {
    Config.setControls(this.config.controls);
    const mainWorld = new Level(this.worldInfo);
    this.addScene('mainmenu', new MainMenu());
    this.addScene('worldScene', mainWorld);

    this.start(loader).then(() => {
      this.goToScene('mainmenu').then(() => {
        console.log(this.currentSceneName);
      });
      
    });
  }
}


const playerInfo: playerInfoType = {
  nickname: "TrianMARC",
  position: new Vector(123, 485),
  zIndex: 8,
  progress: {
    exp: 0,
    expNextLevel: 100,
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

const generateMonster = (x: number, y: number) => {
  return { 
    npcName: "Slime",
    pos: {x, y, z: 9},
    health: 100,
    sprite: "monster_001",
    spriteSize: {
      width: spriteSize.small,
      height: spriteSize.small
    },
    type: NPCTypes.AGRESSIVE,
    rewards: {
      exp: 100,
    },
    stats: {
      level: 2,
      f_attack: 10,
      f_defense: 2,
      m_attack: 2,
      m_defense: 2,
      speed: 3,
      cSpeed: 2,
      agi: 2,
      con: 2
    }
  };
};

const config: configType = {
  controls: {
    keyboard: keyboardConfig,
  }
};

const npcList = new Array<npcType>();

for(let i = 0; i < 5; i++) {
  npcList.push(generateMonster(
    491+Math.random()*132,
    203+Math.random()*258
  ));
}


const worldInfo: worldInfoType = {
  playerInfo,
  npcList
};

export const game = new Game(worldInfo, config);

game.screen.events.on('resize', () => calculateExPixelConversion(game.screen));

game.showDebug(true);
game.start(loader).then(() => {
  calculateExPixelConversion(game.screen);
});
game.initialize();