import { Component } from "excalibur";

export class ExperienceComponent extends Component {
    private _experience: number;
    private _level: number;
    
    constructor() {
        super();
        this._experience = 0;
        this._level = 1;
    }
    
    get experience(): number {
        return this._experience;
    }
    
    set experience(value: number) {
        this._experience = Math.max(value, 0);
        this.checkLevelUp();
    }

    set level(value: number) {
        this._level = Math.max(value, 1);
    }
    
    get level(): number {
        return this._level;
    }
    
    private checkLevelUp(): void {
        const requiredExperience = this.calculateRequiredExperience(this._level);
        if (this._experience >= requiredExperience) {
            this._level++;
            this._experience -= requiredExperience;
        }
    }
    
    private calculateRequiredExperience(level: number): number {
        return Math.floor(100 * Math.pow(1.2, level - 1)); // Example formula
    }
}
