import React, { useState } from 'react';
import { useGameEvent } from "ui/clientState/hooks/useGameEvent/useGameEvent";
import PlayerInfoContext, { PlayerInfo } from './PlayerInfoContext';
import { HudPlayerEvents } from 'state/helpers/PlayerEvents';

const PlayerInfoProvider = ({children}) => {
  const [nickname, setNickname] = useState('Player');
  const [lvl, setLvl] = useState(1);
  const [remainingHP, setRemainingHP] = useState(50);
  const [totalHP, setTotalHP] = useState(100);
  const [hpPercentage, setHPPercentage] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [isDeadPopupCallback, setIsDeadPopupCallback] = useState<() => void>(() => {});

  useGameEvent({
    event: HudPlayerEvents.HUD_PLAYER_INFO_UPDATE,
    callback: ({ nickname, lvl, remainingHP, totalHP }: PlayerInfo) => {
      setNickname(nickname);
      setLvl(lvl);
      setRemainingHP(remainingHP);
      setTotalHP(totalHP);
      setHPPercentage((remainingHP / totalHP) * 100);
    }
  });

  useGameEvent({
    event: HudPlayerEvents.HUD_PLAYER_LVL_UPDATE,
    callback: ({ lvl }: PlayerInfo) => {
      setLvl(lvl);
    }
  });

  useGameEvent({
    event: HudPlayerEvents.HUD_PLAYER_REMAINING_HP,
    callback: ({ remainingHP }: PlayerInfo) => {
      setRemainingHP(remainingHP);
      setHPPercentage((remainingHP / totalHP) * 100);
      if(isDead === true && remainingHP > 0) {
        setIsDead(false);
      }
  }
  });

  useGameEvent({
    event: HudPlayerEvents.HUD_PLAYER_HEALTH_DEPLETED,
    callback: ({ onRevive }) => {
      setIsDead(true);
      setIsDeadPopupCallback(() => onRevive);
    }
  });

  return (
    <PlayerInfoContext.Provider value={
      {
        nickname,
        lvl,
        remainingHP,
        totalHP,
        hpPercentage,
        isDead,
        isDeadPopupCallback,
      }
    }>
      {children}
    </PlayerInfoContext.Provider>
  )
};

export default PlayerInfoProvider;