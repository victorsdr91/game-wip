import { DisplayMode, Engine, Vector } from "excalibur";
import { loader } from "./resources";
import { Level } from "./scenes/Level1/Level";
import { MainMenu } from "./scenes/MainMenu/MainMenu";
import { agressiveNpcType, playerInfoType, spriteSize, worldInfoType } from "./scenes/Level1/contract";
import { configType } from "./contract";
import { default as keyboardConfig} from '../public/config/keyboard.json';
import { Config } from "./state/Config";
import { calculateExPixelConversion } from "./ui/utils/calculateExPixelConversion";
import { PacificNpcType } from "./model/npc/contract";
import { playerInfo } from "./mocks/player";
import { ItemFactory } from "./factory/Item/ItemFactory";
import ITEMS from "./mocks/items.json";

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

  async setUpGame()  {
    console.log("Setting up game...");
    try {
      Config.setControls(this.config.controls);
      ItemFactory.loadItems(ITEMS);
      const mainWorld = new Level(this.worldInfo);
      this.addScene('mainmenu', new MainMenu());
      this.addScene('worldScene', mainWorld);

      await this.goToScene('mainmenu');
      console.log("Current scene:", this.currentSceneName);
    } catch (error) {
      console.error("Error setting up game:", error);
    }
  }
}

const generateMonster = (x: number, y: number): agressiveNpcType => {
  return { 
    name: "Slime",
    pos: {x, y, z: 9},
    currentHealth: 128,
    maxHealth: 128,
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

const agressiveNPCs = new Array<agressiveNpcType>();

for(let i = 0; i < 5; i++) {
  agressiveNPCs.push(generateMonster(
    491+Math.random()*132,
    203+Math.random()*258
  ));
}


const worldInfo: worldInfoType = {
  playerInfo,
  agressiveNPCs,
  pacificNPCs: new Array<PacificNpcType>(),
};

export const game = new Game(worldInfo, config);

game.screen.events.on('resize', () => calculateExPixelConversion(game.screen));
game.showDebug(true);

game.start(loader).then(() => {
  calculateExPixelConversion(game.screen);
  game.setUpGame().catch(error => {
    console.error("Failed to setup game:", error);
  });
});
