import { useEffect } from "react";
import { Game } from "services/Game"

export interface useGameEventProps {
    event: string;
    callback: (...args: any[]) => void;
};

export const useGameEvent = ({ event, callback }: useGameEventProps) => {
    useEffect(() => {
        const game = Game.getInstance();
        const subscription = game.on(event, callback);
        
        return () => {
            subscription.close();
        };
    }, [event, callback]);
};