import { Color, Font, ScreenElement, Text } from "excalibur";

export class GameText extends ScreenElement {
    private text: string; 
    private size: number; 

    constructor(text: string, size: number, position: { x: number, y: number}) {
      super(position);
      this.text = text;
      this.size = size;
    }
    onInitialize() {
        const text = new Text({ text: this.text, font: new Font({size: this.size, color: Color.Gray, strokeColor: Color.DarkGray})});
        this.graphics.add(text);
    }
  }