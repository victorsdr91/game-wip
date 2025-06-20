import { useGameEvent } from 'ui/clientState/hooks/useGameEvent/useGameEvent';
import React from 'react';
import { GameEvents } from 'state/helpers/GameEvents';

const HudWrapper = ({ children }) => {
    const [ showHud, setShowHud ] = React.useState(false);

    useGameEvent({
        event: GameEvents.HUD_TOGGLE,
        callback: ({show}) => setShowHud(show),
    });

    const classList = `font-[PublicPixel] excalibur-scale absolute text-amber-200 text-xs ${showHud ? 'show' : 'hide'}`;

    return (
    <div id="hud" className={ classList }>
        {children}
    </div>);
};

export default HudWrapper;