import { createContext } from 'react';

export interface PlayerInfo {
  nickname: string;
  lvl: number;
  remainingHP: number;
  totalHP: number;
  hpPercentage: number;
  isDead: boolean;
  isDeadPopupCallback: () => void;
};

const playerInfo: PlayerInfo = {
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