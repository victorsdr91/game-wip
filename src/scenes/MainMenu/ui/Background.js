"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Background = void 0;
const excalibur_1 = require("excalibur");
const resources_1 = require("../resources");
class Background extends excalibur_1.ScreenElement {
    constructor(position) {
        super(position);
    }
    onInitialize() {
        this.graphics.add(resources_1.MainMenuResources.TitleBackground.toSprite());
    }
}
exports.Background = Background;
