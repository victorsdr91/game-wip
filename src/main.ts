import { DisplayMode, Engine, Scene, Vector } from "excalibur";
import { loader } from "./resources";
import { Level1 } from "./Scenes/Level1/level1";
import { MainMenu } from "./Scenes/MainMenu/MainMenu";
import { playerInfoType, worldInfoType } from "./Scenes/Level1/contract";

class Game extends Engine {
  constructor() {
    super({
      width: 1366,
      height: 768,
      displayMode: DisplayMode.FitScreen
    });
  }
  initialize(worldInfo: worldInfoType)  {

    const mainWorld = new Level1(worldInfo);
    this.addScene('mainmenu', new MainMenu());
    this.addScene('worldScene', mainWorld);

    this.start(loader).then(() => {
      this.goToScene('mainmenu').then(() => {
        console.log(this.currentSceneName);
      });
      
    });
  }
}

export const game = new Game();
const playerInfo: playerInfoType = {
  nickname: "TrianMARC",
  position: new Vector(575, 498),
  zIndex: 4,
};

const worldInfo: worldInfoType = {
  playerInfo,
}
game.showDebug(true);
game.initialize(worldInfo);