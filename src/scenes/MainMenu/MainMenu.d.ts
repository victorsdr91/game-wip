import { Engine, Scene } from "excalibur";
export declare class MainMenu extends Scene {
    private fullScreenButton;
    private fullScreenButtonText;
    private windowedButtonText;
    constructor();
    /**
     * Start-up logic, called once
     */
    onInitialize(engine: Engine): void;
    onPreUpdate(engine: Engine, delta: number): void;
    private setFullScreen;
}
