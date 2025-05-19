"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const excalibur_1 = require("excalibur");
const resources_1 = require("../resources");
class Button extends excalibur_1.ScreenElement {
    constructor(callBack, position) {
        super(position);
        this.callBack = callBack;
    }
    onInitialize() {
        const buttonSprite = resources_1.MainMenuResources.Button.toSprite();
        const buttonHoverSprite = resources_1.MainMenuResources.ButtonHover.toSprite();
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
exports.Button = Button;
