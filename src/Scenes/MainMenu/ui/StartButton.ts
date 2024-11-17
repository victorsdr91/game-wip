import { Font, ScreenElement, Text } from "excalibur";

export class StartButton extends ScreenElement {
    public callBack: () => void;
    constructor(callBack: () => void) {
      super({
        x: 480,
        y: 350,
      });
      this.callBack = callBack;
    }
    onInitialize() {
        const text = new Text({ text: "Start", font: new Font({size: 25})});

        this.graphics.add(text);
        this.on('pointerup', () => {
            this.callBack();
        });
    }
  }