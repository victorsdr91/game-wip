import React from 'react';
import HudWrapper from './components/Hud/HudWrapper';
import PlayerNameplate from './components/PlayerNameplate/PlayerNameplate';
import PlayerDeadPopup from './components/PlayerDeadPopup/PlayerDeadPopup';
import PlayerInfoProvider from './clientState/providers/PlayerInfoProvider/PlayerInfoProvider';
import PlayerInventory from './components/PlayerInventory/PlayerInventory';

export const UI = () => {
  return (
    <PlayerInfoProvider>
      <HudWrapper>
        <PlayerNameplate />
        <PlayerInventory />
        
      </HudWrapper>
      <DevDisclaimer />
      <ControlsHelp />
      <PlayerDeadPopup />
    </PlayerInfoProvider>
    );
};

const DevDisclaimer = () => (
  <div className="fixed top-5 left-1/3 text-white text-center p-2 bg-black opacity-55 rounded-sm">
    <div className="text-red-500 inline font-extrabold">!! </div>
      This game is in development phase. Don't expect anything to work correctly by now.
      <br/>The appeareance of the current elements of the game can be completely different from the final product.
      <br/>Multiple bugs will appear during the curse of the game. I am working on it.
      <br/>Sincerely @victorsdr91.
  </div>
);

const ControlsHelp = () => (
  <div className="fixed bottom-1/8 left-1/5 text-white text-center p-2 bg-black opacity-55 rounded-sm">
      <div>Press <strong>W A S D</strong> to move around.</div>
      <div>Maintain pressed <strong>Left Shift</strong> to run.</div>
      <div>Press <strong>1</strong> to attack.</div>
      <div>Press <strong>B</strong> to open de bag.</div>
  </div>
);