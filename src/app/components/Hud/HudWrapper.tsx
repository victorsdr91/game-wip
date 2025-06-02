import React from 'react';

const HudWrapper = ({ children }) => {
    return (
    <div id="hud" className="font-[PublicPixel] excalibur-scale hide absolute bg-amber-900 text-amber-200 text-xs">
        {children}
    </div>);
};

export default HudWrapper;