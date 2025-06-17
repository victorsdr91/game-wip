import { HudPlayerEvents } from "state/helpers/PlayerEvents";

export interface Coordinates {
    x: number;
    y: number;
    z?: number;
}

export interface GameWindowProps {
    children: React.ReactNode;
    windowHeader: React.ReactNode;
    initialPosition: Coordinates;
    playerEvent?: HudPlayerEvents;
    show?: boolean;
}