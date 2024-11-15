import { Engine, Vector } from "excalibur";
import { loader } from "./resources";
import { Level1 } from "./Scenes/Level1/level1";
import { Player } from "./player";
import { Resources } from "./resources";

class Game extends Engine {
  constructor() {
    super({width: 800, height: 600});
  }
  initialize() {
    this.addScene('level1', Level1);
    const player = new Player(new Vector(575.5, 498.5));
    
    player.z = 4;
    this.currentScene.add(player);
    this.currentScene.camera.strategy.lockToActor(player);
    this.currentScene.camera.zoom = 1.5;
    this.start(loader).then(() => {
      Resources.Level1Map.addToScene(this.currentScene);
    });

  }
}

export const game = new Game();
game.initialize();