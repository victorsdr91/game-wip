"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    constructor() {
        throw new Error('class cannot be instantiated');
    }
    static getControls() {
        return this.controller;
    }
    static setControls(controls) {
        this.controller = controls;
    }
}
exports.Config = Config;
