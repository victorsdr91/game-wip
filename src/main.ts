import { DisplayMode, Engine, Scene, Vector } from "excalibur";
import { loader } from "./resources";
import { Level } from "./scenes/Level1/Level";
import { MainMenu } from "./scenes/MainMenu/MainMenu";
import { npcType, NPCTypes, playerInfoType, worldInfoType } from "./scenes/Level1/contract";

class Game extends Engine {
  constructor() {
    super({
      width: 1366,
      height: 768,
      displayMode: DisplayMode.FitScreen
    });
  }
  initialize(worldInfo: worldInfoType)  {

    const mainWorld = new Level(worldInfo);
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

const npcInfo = { 
  npcName: "Pepito",
  pos: {x:356, y: 550, z: 99},
  health: 100,
  sprite: "human_001",
  dialogue: [ "Hola, que tal?"],
  type: NPCTypes.PACIFIC
}

const npc = new Array<npcType>();
npc.push(npcInfo);

const worldInfo: worldInfoType = {
  playerInfo,
  npc
}
game.showDebug(true);
game.initialize(worldInfo);