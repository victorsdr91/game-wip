import { Component } from "excalibur";
import { ExtendedActor } from "model/ExtendedActor/ExtendedActor";
import { TargetsType } from "../types/target.type";


export class TauntComponent extends Component {
    private _taunted: boolean = false;
    private _targets: TargetsType; // The actor that is taunted, if any
    private readonly _tauntLevelBase: number = 0.1; // Base taunt level, can be adjusted
    
    constructor() {
        super();
        this._targets = new Map<ExtendedActor, number>();
    }
    
    public get isTaunted() {
        return this._taunted;
    }

    public tauntedBy(target: ExtendedActor, tauntLevel: number = this._tauntLevelBase): void {
        if(!this._taunted) {
            this._taunted = true;
            this.addTarget(target, tauntLevel);
        } else {
            // If already taunted, increase the taunt level for the target
            const currentTauntLevel = this._targets.get(target) || 0;
            this._targets.set(target, currentTauntLevel + tauntLevel);
        }
    }
    
    public resetTaunt(): void {
        this._taunted = false;
    }
    private addTarget(target: ExtendedActor, tauntLevel: number): void {
        this._targets.set(target, tauntLevel);
    }
    public removeTarget(target: ExtendedActor): void {
        this._targets.delete(target);
    }
    public getTargets(): TargetsType {
        return this._targets;
    }
    public isTargetedBy(target: ExtendedActor): boolean {
        return this._targets.has(target);
    }
    public getTauntedTarget(): ExtendedActor | null {
        const target = this.getTargetsByTauntLevel().entries().next().value?.[0] || null;
        return target;// Return the first taunted target
    }
    public clearTargets(): void {
        this._targets.clear();
        this.resetTaunt();
    }
    public isEmpty(): boolean {
        return this._targets.size === 0;
    }
    public getTargetTauntPercent(target: ExtendedActor): number {
        return this._targets.get(target) || 0;
    }
    public get tauntLevelBase(): number {
        return this._tauntLevelBase;
    }

    public getTargetsByTauntLevel(): TargetsType {
        const sortedTargets = new Map<ExtendedActor, number>(
            Array.from(this._targets.entries()).sort((a, b) => b[1] - a[1])
        );
        return sortedTargets;
    }

}