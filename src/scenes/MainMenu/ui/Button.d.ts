import { ScreenElement } from "excalibur";
export declare class Button extends ScreenElement {
    private callBack;
    constructor(callBack: () => void, position: {
        x: number;
        y: number;
    });
    onInitialize(): void;
}
