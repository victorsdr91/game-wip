import { useEffect } from "react";
import { Game } from "services/Game"

export interface useGameEventProps {
    event: string;
    callback: (...args: any[]) => void;
};

export const useGameEvent = async ({ event, callback }: useGameEventProps) => {
    const gameInstance = Game.getInstance();
    useEffect(() => {
        gameInstance.on(event, callback);

        return () => {
            gameInstance.off(event, callback);
        };
    },[event, callback]);
};