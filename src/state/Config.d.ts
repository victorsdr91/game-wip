import { controlsType } from "../contract";
export declare class Config {
    private static controller;
    constructor();
    static getControls(): controlsType;
    static setControls(controls: controlsType): void;
}
