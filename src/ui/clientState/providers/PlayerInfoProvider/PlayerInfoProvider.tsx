import React, { useCallback, useState } from 'react';
import { useGameEvent } from "ui/clientState/hooks/useGameEvent/useGameEvent";
import PlayerInfoContext, { defaultEquipmentSlots, defaultStats, PlayerInfo } from './PlayerInfoContext';
import { HudPlayerEvents } from 'state/helpers/PlayerEvents';
import { ActorStats } from 'model/ExtendedActor/contract';
import { EquipmentSlotsType, EquipmentType } from 'model/Player/contract';

const PlayerInfoProvider = ({children}) => {
  const [nickname, setNickname] = useState('Player');
  const [stats, setStats] = useState<ActorStats>(defaultStats);
  const [level, setLevel] = useState<number>(1);
  const [experience, setExperience] = useState<number>(1);
  const [equipment, setEquipment] = useState<EquipmentType>({});
  const [equipmentSlots, setEquipmentSlots] = useState<EquipmentSlotsType>(defaultEquipmentSlots);
  const [remainingHP, setRemainingHP] = useState(50);
  const [totalHP, setTotalHP] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [isDeadPopupCallback, setIsDeadPopupCallback] = useState<() => void>(() => {});

  const handlePlayerInfoUpdate = useCallback(({ nickname, stats, level, experience, equipment, equipmentSlots, remainingHP, totalHP }: PlayerInfo) => {
        setNickname(nickname);
        setLevel(level);
        setExperience(experience);
        setStats({ ...stats});
        setEquipment(equipment);
        setEquipmentSlots(equipmentSlots);
        setRemainingHP(remainingHP);
        setTotalHP(totalHP);
    }, []);

  useGameEvent({
    event: HudPlayerEvents.HUD_PLAYER_INFO_UPDATE,
    callback: handlePlayerInfoUpdate,
  });

  useGameEvent({
    event: HudPlayerEvents.HUD_PLAYER_STATS_UPDATE,
    callback: ({ stats }: PlayerInfo) => {
      setStats({ ...stats});
      setLevel(stats.level);
    }
  });

  useGameEvent({
    event: HudPlayerEvents.HUD_PLAYER_REMAINING_HP,
    callback: ({ remainingHP }: PlayerInfo) => {
      setRemainingHP(remainingHP);
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
        level,
        experience,
        stats,
        equipment,
        equipmentSlots,
        remainingHP,
        totalHP,
        isDead,
        isDeadPopupCallback,
      }
    }>
      {children}
    </PlayerInfoContext.Provider>
  )
};

export default PlayerInfoProvider;