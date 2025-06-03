export enum HudPlayerEvents {
    HUD_PLAYER_INFO_UPDATE = 'hud_player_info_update',
    HUD_PLAYER_LVL_UPDATE = 'hud_player_lvl_update',
    HUD_PLAYER_REMAINING_HP = 'hud_player_remaining_hp',
    HUD_PLAYER_HEALTH_DEPLETED = 'hud_player_health_depleted',
    HUD_PLAYER_INFO_RESET = 'hud_player_info_reset',
}

export interface HudPlayerInfoUpdate {
    nickname: string;
    lvl: number;
    totalHP: number;
    remainingHP: number;
}
export interface HudPlayerLvlUpdate {
    lvl: number;
}
export interface HudPlayerRemainingHP {
    remainingHP: number;
}
export interface HudPlayerHealthDepleted {
    callback: () => void;
}