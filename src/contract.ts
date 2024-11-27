export interface configType {
    controls: controlsType
}

export interface controlsType {
    keyboard: keyboardType;
}

interface keyboardType {
    movement: {
        up: string;
        down: string;
        left: string;
        right: string;
        run: string;
    }
}