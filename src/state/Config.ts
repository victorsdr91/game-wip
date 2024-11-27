import { controlsType } from "../contract";

export class Config {
    private static controller: controlsType; 
    
    constructor() {
        throw new Error('class cannot be instantiated');
    }

    public static getControls(): controlsType {
        return this.controller;
    }

    public static setControls(controls: controlsType): void {
        this.controller = controls;
    }

}