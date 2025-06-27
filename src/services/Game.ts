import { configType } from "state/config/contract";
import { Engine, DisplayMode, PointerScope, Keys } from "excalibur";
import { ItemFactory } from "factory/Item/ItemFactory";
import ITEMS from "./../mocks/items.json";
import { worldInfoType } from "scenes/Test/contract";
import { TestLevel } from "scenes/Test/TestLevel";
import { MainMenu } from "scenes/MainMenu/MainMenu";
import { Config } from "state/config/Config";
import { default as keyboardConfig} from '../../public/config/keyboard.json';

export class Game extends Engine {
  private worldInfo!: worldInfoType;
  private config: configType;
  private static instance: Game;

  private constructor() {
    super({
      canvasElementId: 'game',
      width: 1366,
      height: 768,
      pixelArt: true,
      pointerScope: PointerScope.Canvas,
      displayMode: DisplayMode.FitScreen
    });

    this.config = {
      controls: {
        keyboard: keyboardConfig,
      }
    };
  }

  public setWorld(worldInfo: worldInfoType) {
    this.worldInfo = worldInfo;
  }

  async setUpGame()  {
    console.log("Setting up game...");
    try {
      navigator.keyboard.lock([...Object.values(keyboardConfig.movement), ...Object.values(keyboardConfig.shortcuts), ...Object.values(keyboardConfig.skills), "Escape"]);
      Config.setControls(this.config.controls);
      ItemFactory.loadItems(ITEMS);
      const mainWorld = new TestLevel(this.worldInfo);
      this.addScene('mainmenu', new MainMenu());
      this.addScene('worldScene', mainWorld);

      await this.goToScene('mainmenu');
      console.log("Current scene:", this.currentSceneName);
    } catch (error) {
      console.error("Error setting up game:", error);
    }
  }

    static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
}