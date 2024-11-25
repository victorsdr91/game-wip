import { ScreenElement} from "excalibur";
import { MainMenuResources } from "../resources";

export class Background extends ScreenElement {
    private callBack: () => void;

    constructor(position: {x: number, y: number}) {
      super(position);
    }
    onInitialize() {
       this.graphics.add(MainMenuResources.TitleBackground.toSprite());
    }
  }