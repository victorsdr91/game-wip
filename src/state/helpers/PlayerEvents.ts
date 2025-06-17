import { ItemGroup } from "model/Item/ItemGroup";
import { SlotType } from "model/Player/types/SlotType.enum";

export enum HudPlayerEvents {
    HUD_PLAYER_INFO_UPDATE = 'hud_player_info_update',
    HUD_PLAYER_LVL_UPDATE = 'hud_player_lvl_update',
    HUD_PLAYER_REMAINING_HP = 'hud_player_remaining_hp',
    HUD_PLAYER_HEALTH_DEPLETED = 'hud_player_health_depleted',
    HUD_PLAYER_INFO_RESET = 'hud_player_info_reset',
    HUD_PLAYER_INVENTORY_UPDATE = 'hud_player_inventory_update',
    HUD_PLAYER_INVENTORY_ITEM_ADDED = 'hud_player_inventory_item_added',
    HUD_PLAYER_INVENTORY_ITEM_MOVED = 'hud_player_inventory_item_moved',
    HUD_PLAYER_INVENTORY_ITEM_DROPPED = "hud_player_inventory_item_dropped",
    HUD_PLAYER_ITEM_DROPPED_IN_WORLD = "HUD_PLAYER_ITEM_DROPPED_IN_WORLD",
    HUD_PLAYER_EQUIPMENT_ITEM_MOVED = "HUD_PLAYER_EQUIPMENT_ITEM_MOVED",
    HUD_PLAYER_TOGGLE_INVENTORY = "HUD_PLAYER_TOGGLE_INVENTORY",
    HUD_PLAYER_TOGGLE_PROFILE = "HUD_PLAYER_TOGGLE_PROFILE",
    HUD_PLAYER_STATS_UPDATE = "HUD_PLAYER_STATS_UPDATE",
    HUD_PLAYER_EQUIP_ITEM = 'hud_player_equip_item',
    HUD_PLAYER_UNEQUIP_ITEM = 'hud_player_unequip_item',
    HUD_PLAYER_DROP_ITEM_CONFIRM = 'hud_player_drop_item_confirm'
}

export interface InventoryEventPayload {
    slots: number;
    maxWeight: number;
    currentWeight: number;
    items: Map<number, ItemGroup>; // key: slotId
    itemPositions: Map<number, { x: number; y: number; }>; // key: slotId
    findFirstEmptySlot: () => number | null;
}

export interface EquipItemPayload {
    fromSlot: number;
    toSlot: SlotType;
    itemGroup: ItemGroup;
}

export interface UnequipItemPayload {
    fromSlot: SlotType;
    toSlot: number;
    itemGroup: ItemGroup;
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