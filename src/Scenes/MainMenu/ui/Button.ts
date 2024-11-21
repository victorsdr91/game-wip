import { Color, Font, ScreenElement, Text } from "excalibur";

export class Button extends ScreenElement {
    private callBack: () => void;
    private value: string;

    constructor(callBack: () => void, value: string, position: {x: number, y: number}) {
      super(position);
      this.callBack = callBack;
      this.value = value;
    }
    onInitialize() {
        const text = new Text({ text: this.value, font: new Font({size: 25, color: Color.White})});

        this.graphics.add(text);
        this.on('pointerup', () => {
            this.callBack();
        });
        this.on('pointerenter', () => {
          text.opacity = 0.4;
        });
        this.on('pointerleave', () => {
          text.opacity = 1;
        });
    }
  }