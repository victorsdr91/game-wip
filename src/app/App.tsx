import React from 'react';
import GameCanvas from './components/GameCanvas/GameCanvas';
import HudWrapper from './components/Hud/HudWrapper';
import PlayerNameplate from './components/PlayerNameplate/PlayerNameplate';
import PlayerDeadPopup from './components/PlayerDeadPopup/PlayerDeadPopup';
import PlayerInfoProvider from './clientState/providers/PlayerInfoProvider/PlayerInfoProvider';
import PlayerInventory from './components/PlayerInventory/PlayerInventory';

export const App = () => {
  return (
    <PlayerInfoProvider>
      <HudWrapper>
        <PlayerNameplate />
        <PlayerInventory />
      </HudWrapper>
      <PlayerDeadPopup />
    </PlayerInfoProvider>
    );
};