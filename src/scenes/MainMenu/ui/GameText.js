"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameText = void 0;
const excalibur_1 = require("excalibur");
class GameText extends excalibur_1.ScreenElement {
    constructor(text, size, position) {
        super(position);
        this.text = text;
        this.size = size;
    }
    onInitialize() {
        const text = new excalibur_1.Text({ text: this.text, font: new excalibur_1.Font({ size: this.size, color: excalibur_1.Color.Gray, strokeColor: excalibur_1.Color.DarkGray }) });
        this.graphics.add(text);
    }
}
exports.GameText = GameText;
