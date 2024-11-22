import { Engine, Scene } from "excalibur";
import { Button } from "./ui/Button";
import { GameText } from "./ui/GameText";
import { Background } from "./ui/Background";
import { mainMenuLoader } from "./resources";

export class MainMenu extends Scene {
    private fullScreenButton: Button;
    private fullScreenButtonText: GameText;
    private windowedButtonText: GameText;

    /**
     * Start-up logic, called once
     */
    public onInitialize(engine: Engine) {
        const startAction = () => { engine.goToScene('worldScene') };
        const startButton = new Button(
            startAction,
            {
                x: 350,
                y: 350,
            }
        );
        const startButtonText = new GameText("START", 26, { x:400, y:365});
        const exitButton = new Button(
            () => {},
            {
                x: 350,
                y: 400,
            }
        );
        const exitButtonText = new GameText("EXIT", 26, { x:410, y:415});

        this.fullScreenButton = new Button(
            () => {this.setFullScreen(engine)},
            {
                x: 350,
                y: 500,
            }
        );
        this.fullScreenButtonText = new GameText("FULL SCREEN", 24, { x:360, y:515});

        this.windowedButtonText = new GameText("WINDOW", 26, { x:385, y:515});
        this.add(new Background({x: 0, y: 0}));
        
        engine.start(mainMenuLoader).then(() => {
            this.add(new Background({x: 0, y: 0}));
            this.add(startButton);
            this.add(exitButton);
            this.add(this.fullScreenButton);
            this.add(startButtonText);
            this.add(exitButtonText);
            this.add(this.fullScreenButtonText);
            
        });
    }

    public onPreUpdate(engine: Engine, delta: number): void {
        if(engine.screen.isFullScreen) {
            this.remove(this.fullScreenButtonText);
            this.add(this.windowedButtonText);
        } else if(this.windowedButtonText.isInitialized) {
            this.remove(this.windowedButtonText);
            this.add(this.fullScreenButtonText);
        }
        
    }

    private setFullScreen(engine: Engine) {
        if(engine.screen.isFullScreen) {
            engine.screen.exitFullScreen();
        } else {
            engine.screen.goFullScreen();
        }
    }

}