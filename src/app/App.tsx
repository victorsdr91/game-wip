import React from 'react';
import GameCanvas from './components/GameCanvas/GameCanvas';
import HudWrapper from './components/Hud/HudWrapper';
import PlayerNameplate from './components/PlayerNameplate/PlayerNameplate';
import PlayerDeadPopup from './components/PlayerDeadPopup/PlayerDeadPopup';
import PlayerInfoProvider from './clientState/providers/PlayerInfoProvider/PlayerInfoProvider';

export const App = () => {
  return (
    <PlayerInfoProvider>
      <GameCanvas />
      <HudWrapper>
        <PlayerNameplate />
      </HudWrapper>
      <PlayerDeadPopup />
    </PlayerInfoProvider>
    );
};