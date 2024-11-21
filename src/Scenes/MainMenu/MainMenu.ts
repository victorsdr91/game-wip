import { Engine, Scene } from "excalibur";
import { Button } from "./ui/Button";
import { GameText } from "./ui/GameText";
import { Background } from "./ui/Background";

export class MainMenu extends Scene {
    private fullScreenButton: Button;
    private windowedButton: Button;

    /**
     * Start-up logic, called once
     */
    public onInitialize(engine: Engine) {
        const startAction = () => { engine.goToScene('worldScene') };
        const startButton = new Button(
            startAction,
            "Start", {
                x: 350,
                y: 350,
            }
        );
        const exitButton = new Button(
            () => {},
            "Exit",
            {
                x: 350,
                y: 380,
            }
        );

        this.fullScreenButton = new Button(
            () => { engine.screen.goFullScreen() },
            "Full-Screen mode",
            {
                x: 350,
                y: 450,
            }
        );

        this.windowedButton = new Button(
            () => { engine.screen.exitFullScreen() },
            "Window mode",
            {
                x: 350,
                y: 450,
            }
        );
        const title = new GameText("GAME WIP", 36, {x: 350, y: 150});
        const description = new GameText("by Victor Sanchez", 20, {x: 350, y: 180});
        this.add(new Background({x: 0, y: 0}));
        this.add(title);
        this.add(description);
        this.add(startButton);
        this.add(exitButton);
        this.add(this.fullScreenButton);
    }

    public onPreUpdate(engine: Engine, delta: number): void {
        if(engine.screen.isFullScreen) {
            this.remove(this.fullScreenButton);
            this.add(this.windowedButton);
        } else {
            this.remove(this.windowedButton);
            this.add(this.fullScreenButton);
        }
        
    }

}