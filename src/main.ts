import { Engine, Scene, Vector } from "excalibur";
import { loader } from "./resources";
import { Level1 } from "./Scenes/Level1/level1";
import { MainMenu } from "./Scenes/MainMenu/MainMenu";

interface playerInfoType {
  nickname: string;
  position: Vector;
  zIndex: number;
}

class Game extends Engine {
  constructor() {
    super({width: 1024, height: 768});
  }
  initialize(scene: Scene)  {
    this.addScene('mainmenu', new MainMenu());
    this.addScene('worldScene', scene);

    this.start(loader).then(() => {
      this.goToScene('mainmenu').then(() => {
        console.log(this.currentSceneName);
      });
      
    });
  }
}

export const game = new Game();
const playerInfo = {
  nickname: "TrianMARC",
  position: new Vector(575, 498),
  zIndex: 4,
};
game.showDebug(true);
game.initialize(new Level1(playerInfo));