"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenu = void 0;
const excalibur_1 = require("excalibur");
const Button_1 = require("./ui/Button");
const GameText_1 = require("./ui/GameText");
const Background_1 = require("./ui/Background");
const resources_1 = require("./resources");
class MainMenu extends excalibur_1.Scene {
    constructor() {
        super();
        this.windowedButtonText = new GameText_1.GameText("WINDOW", 26, { x: 385, y: 515 });
        this.fullScreenButtonText = new GameText_1.GameText("FULL SCREEN", 24, { x: 360, y: 515 });
        this.fullScreenButton = new Button_1.Button(() => { this.setFullScreen(this.engine); }, {
            x: 350,
            y: 500,
        });
    }
    /**
     * Start-up logic, called once
     */
    onInitialize(engine) {
        const startAction = () => { engine.goToScene('worldScene'); };
        const startButton = new Button_1.Button(startAction, {
            x: 350,
            y: 350,
        });
        const startButtonText = new GameText_1.GameText("START", 26, { x: 400, y: 365 });
        const exitButton = new Button_1.Button(() => { }, {
            x: 350,
            y: 400,
        });
        const exitButtonText = new GameText_1.GameText("EXIT", 26, { x: 410, y: 415 });
        this.add(new Background_1.Background({ x: 0, y: 0 }));
        engine.start(resources_1.mainMenuLoader).then(() => {
            this.add(new Background_1.Background({ x: 0, y: 0 }));
            this.add(startButton);
            this.add(exitButton);
            this.add(this.fullScreenButton);
            this.add(startButtonText);
            this.add(exitButtonText);
            this.add(this.fullScreenButtonText);
        });
    }
    onPreUpdate(engine, delta) {
        if (engine.screen.isFullScreen) {
            this.remove(this.fullScreenButtonText);
            this.add(this.windowedButtonText);
        }
        else if (this.windowedButtonText.isInitialized) {
            this.remove(this.windowedButtonText);
            this.add(this.fullScreenButtonText);
        }
    }
    setFullScreen(engine) {
        if (engine.screen.isFullScreen) {
            engine.screen.exitFullScreen();
        }
        else {
            engine.screen.goFullScreen();
        }
    }
}
exports.MainMenu = MainMenu;
