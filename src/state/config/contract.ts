export interface configType {
    controls: controlsType
}

export interface controlsType {
    keyboard: keyboardType;
}

export interface keyboardType {
    movement: keyboardMovement
        
    skills: keyboardSkill;
    shortcuts: keyboardShortcuts;
}

interface keyboardMovement {
    up: string;
    down: string;
    left: string;
    right: string;
    run: string;
}

interface keyboardSkill {
    first: string;
}

interface keyboardShortcuts {
    bag: string;
    player: string;
}