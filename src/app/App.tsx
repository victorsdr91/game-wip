import React from 'react';
import GameCanvas from './components/GameCanvas/GameCanvas';
import HudWrapper from './components/Hud/HudWrapper';
import PlayerNameplate from './components/PlayerNameplate/PlayerNameplate';
import PlayerDeadPopup from './components/PlayerDeadPopup/PlayerDeadPopup';

export const App = () => {
  return <>
    <GameCanvas />
    <HudWrapper>
      <PlayerNameplate />
    </HudWrapper>
    <PlayerDeadPopup />
    </>;
};