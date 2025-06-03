import { createContext } from 'react';

const playerInfo = {
  nickname: 'Player',
  lvl: 1,
  remainingHP: 100,
  totalHP: 100,
  hpPercentage: 100,
  isDead: false,
  isDeadPopupCallback: () => {},
};

const PlayerInfoContext = createContext(playerInfo);

export default PlayerInfoContext;