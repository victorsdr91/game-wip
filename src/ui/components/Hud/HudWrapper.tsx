import { useGameEvent } from 'ui/clientState/hooks/useGameEvent/useGameEvent';
import React from 'react';
import { GameEvents } from 'state/helpers/GameEvents';
import keyboard from "../../../../public/config/keyboard.json";

const HudWrapper = ({ children, setIsPlayerInteracting }) => {
    const [ showHud, setShowHud ] = React.useState(false);

    useGameEvent({
        event: GameEvents.HUD_TOGGLE,
        callback: ({show}) => setShowHud(show),
    });

    const onKeyDown = (event) => {
        event.preventDefault();
        if(event.code === keyboard.shortcuts.interact) {
            setIsPlayerInteracting(true);
        }
    }

    const onKeyUp = (event) => {
        if(event.code === keyboard.shortcuts.interact) {
            event.preventDefault();
            setIsPlayerInteracting(false);
        }
    }

    return (
    <div id="hud" className={ `font-[PublicPixel] excalibur-scale absolute text-amber-200 text-xs ${showHud ? 'show' : 'hide'} h-svh w-full` } onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0}>
        {children}
    </div>);
};

export default HudWrapper;