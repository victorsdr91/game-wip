import { DisplayMode, Engine, Scene, Vector } from "excalibur";
import { loader } from "./resources";
import { Level } from "./scenes/Level1/Level";
import { MainMenu } from "./scenes/MainMenu/MainMenu";
import { npcType, NPCTypes, playerInfoType, spriteSize, worldInfoType } from "./scenes/Level1/contract";
import { configType } from "./contract";
import { default as keyboardConfig} from '../public/config/keyboard.json';
import { Config } from "./state/Config";

class Game extends Engine {
  private worldInfo: worldInfoType;
  private config: configType;

  constructor(worldInfo: worldInfoType, config: configType) {
    super({
      width: 1366,
      height: 768,
      displayMode: DisplayMode.FitScreen
    });
    this.worldInfo = worldInfo;
    this.config = config;
  }
  initialize()  {
    Config.setControls(config.controls);
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
  position: new Vector(575, 498),
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

const human = { 
  npcName: "Pepito",
  pos: {x:356, y: 550, z: 6},
  health: 100,
  sprite: "human_001",
  spriteSize: {
    width: spriteSize.small,
    height: spriteSize.medium
  },
  dialogue: [ "Hola, que tal?"],
  type: NPCTypes.PACIFIC,
  rewards: {
    exp: 0,
  },
  stats: {
    level: 100,
    f_attack: 2,
    f_defense: 2,
    m_attack: 2,
    m_defense: 2,
    speed: 3,
    cSpeed: 2,
    agi: 2,
    con: 2
  }
};

const monster = { 
  npcName: "Slime",
  pos: {x:230, y: 414, z: 6},
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
    f_attack: 2,
    f_defense: 2,
    m_attack: 2,
    m_defense: 2,
    speed: 3,
    cSpeed: 2,
    agi: 2,
    con: 2
  }
};

const config: configType = {
  controls: {
    keyboard: keyboardConfig,
  }
};

const npcList = new Array<npcType>();
npcList.push(human);
npcList.push(monster);

const worldInfo: worldInfoType = {
  playerInfo,
  npcList
};

export const game = new Game(worldInfo, config);
game.showDebug(true);
game.initialize();