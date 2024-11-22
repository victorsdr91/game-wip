import { ScreenElement } from "excalibur";
import { MainMenuResources } from "../resources";

export class Button extends ScreenElement {
    private callBack: () => void;

    constructor(callBack: () => void, position: {x: number, y: number}) {
      super(position);
      this.callBack = callBack;
    }
    onInitialize() {
        const buttonSprite = MainMenuResources.Button.toSprite();
        const buttonHoverSprite = MainMenuResources.ButtonHover.toSprite();
        this.graphics.add("button", buttonSprite);
        this.graphics.add("button-hover", buttonHoverSprite);

        this.graphics.use("button");

        this.on('pointerup', () => {
            this.callBack();
        });
        this.on('pointerenter', () => {
          this.graphics.use("button-hover");
        });
        this.on('pointerleave', () => {
          this.graphics.use("button");
        });
    }
  }