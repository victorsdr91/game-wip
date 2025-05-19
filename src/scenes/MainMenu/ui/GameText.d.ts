import { ScreenElement } from "excalibur";
export declare class GameText extends ScreenElement {
    private text;
    private size;
    constructor(text: string, size: number, position: {
        x: number;
        y: number;
    });
    onInitialize(): void;
}
