import { ActorStats } from 'model/ExtendedActor/contract';
import { EquipmentSlotsType, EquipmentType } from 'model/Player/contract';
import { createContext } from 'react';

export interface PlayerInfo {
  nickname: string,
  level: number,
  stats: ActorStats,
  equipment: EquipmentType,
  equipmentSlots: EquipmentSlotsType,
  experience: number,
  totalHP: number,
  remainingHP: number,
  isDead: boolean;
  isDeadPopupCallback: () => void;
};

export const defaultStats: ActorStats = {
    level: 1,
    f_attack: 1,
    f_defense: 1,
    m_attack: 1,
    m_defense: 1,
    speed: 1,
    cSpeed: 1,
    agi: 1,
    con: 1,
    f_damage: 1,
    m_damage: 1,
    critical_rate: 1,
}

export const defaultEquipment: EquipmentType = {};
export const defaultEquipmentSlots: EquipmentSlotsType = new Map();

const playerInfo: PlayerInfo = {
  nickname: 'Player',
  level: 0,
  experience: 0,
  stats: defaultStats,
  equipment: defaultEquipment,
  equipmentSlots: defaultEquipmentSlots,
  remainingHP: 100,
  totalHP: 100,
  isDead: false,
  isDeadPopupCallback: () => {},
};

const PlayerInfoContext = createContext(playerInfo);

export default PlayerInfoContext;