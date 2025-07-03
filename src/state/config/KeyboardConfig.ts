import { keyboardType } from "state/config/contract";
import { Config } from "./Config";
import { Engine, Keys } from "excalibur";

export type KeyMap = Map<string, KeyCallback>;
export type SkillMap = Map<string, {press: KeyCallback, release: KeyCallback}>;
export type KeyCallback = () => void;
export interface KeyboardConfigProps {
    movement: Map<string, KeyCallback>;
    skills: Map<string, {press: KeyCallback, release: KeyCallback}>;
    shortcuts: Map<string, KeyCallback>;
}

export class KeyboardConfig {
    private controlMap: KeyMap;
    private shortcutMap: KeyMap;
    private skillMap: SkillMap;
    
    
    constructor({ movement, skills, shortcuts }: KeyboardConfigProps) {
        
        this.controlMap = new Map<string, KeyCallback>();
        this.shortcutMap = new Map<string, KeyCallback>();
        this.skillMap = new Map<string, {press: KeyCallback, release: KeyCallback}>();
        
        this.mapKeys("shortcuts", shortcuts, this.shortcutMap);
        this.mapKeys("movement", movement, this.controlMap);
        this.mapSkills("skills", skills, this.skillMap);
    }

    private mapKeys(name: string, map: KeyMap, target: KeyMap) {
        const keyboardAssignments: keyboardType = Config.getControls().keyboard;
        Object.keys(keyboardAssignments[name])
            .forEach((key) => 
            { 
                const callback = map.get(key);
                if (callback) {
                    target.set(keyboardAssignments[name][key], callback);
                }
            }
            );
    }

    private mapSkills(name: string, map: SkillMap, target: SkillMap) {
        const keyboardAssignments: keyboardType = Config.getControls().keyboard;
        Object.keys(keyboardAssignments[name])
            .forEach((key) => 
            { 
                const callback = map.get(key);
                if (callback) {
                    target.set(keyboardAssignments[name][key], callback);
                }
            }
            );
    }

    public bindKeys(engine: Engine) {
        this.bindControls(engine);
        this.bindShortCuts(engine);
        this.bindSkills(engine);
        this.setUpEscapeControl(engine);
    }

    public bindControls(engine: Engine) {
        Object.values(Keys)
            .filter((key) => 
                engine.input.keyboard.isHeld(key)
            )
            .forEach((key) => 
            { 
                this.controlMap.get(key)?.();
            }
            );
    }

    public bindShortCuts(engine: Engine) {
        Object.values(Keys)
            .filter((key) => 
            engine.input.keyboard.wasPressed(key)
            )
            .forEach((key) => 
            { 
                this.shortcutMap.get(key)?.();
            }
            );
    }

    public bindSkills(engine: Engine) {
        Object.values(Keys)
            .filter((key) => 
            engine.input.keyboard.isHeld(key)
            )
            .forEach((key) => 
            { 
                this.skillMap.get(key)?.press();
            }
            );

        Object.values(Keys)
            .filter((key) => 
            engine.input.keyboard.wasReleased(key)
            )
            .forEach((key) => 
            { 
                this.skillMap.get(key)?.release();
            }
            );
    }

    public setUpEscapeControl (engine: Engine) {
    if(engine.input.keyboard.wasPressed(Keys.Escape) && engine.screen.isFullscreen) {
      engine.screen.exitFullscreen();
      engine.screen.applyResolutionAndViewport();
    }
  }

    public getControlMap(): KeyMap {
        return this.controlMap;
    }

    public getShortCutMap(): KeyMap {
        return this.controlMap;
    }

}