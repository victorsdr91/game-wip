import { Engine, Scene } from "excalibur";
import { StartButton } from "./ui/StartButton";
import { loader } from "../../resources";

export class MainMenu extends Scene {
    private _startButton: StartButton;
    private _loaded: boolean = false;
    private startAction: () => void;

    /**
     * Start-up logic, called once
     */
    public onInitialize(engine: Engine) {
        // initialize scene actors
        engine.start(loader).then(() => {
            this._loaded = true;
        });
        this.startAction = () => { engine.goToScene('worldScene') };
        this._startButton = new StartButton(this.startAction);
        this.add(this._startButton);
    }
}