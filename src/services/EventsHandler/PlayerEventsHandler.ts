import { SlotValidator } from "model/Item/SlotValidator";
import { WereableItem } from "model/Item/WereableItem";
import { Player } from "model/Player/Player";
import { EquipItemPayload, HudPlayerEvents, UnequipItemPayload } from "state/helpers/PlayerEvents";
import ex, { EventEmitter } from "excalibur";
import { ActorStats, Attack } from "model/ExtendedActor/contract";
import EventsHandler from "./EventsHandler";
import { AttackType, DamageType, ElementType } from "model/ExtendedActor/types/AttackType.enum";

class PlayerEventsHandler extends EventsHandler {
    private player: Player;

    constructor({ player, eventEmitter}: {player: Player, eventEmitter: EventEmitter}) {
        super(eventEmitter);
        this.player = player;
    }

    initialize() {
        this.handleNpcAttack();
        this.handleMonsterRewards();
        this.handleEquipItem();
        this.handleRemoveEquipment();
        this.updatePlayerInfoHud();
    }

    handleEquipItem() {
        this.gameHandler.on(HudPlayerEvents.HUD_PLAYER_EQUIP_ITEM, (event: unknown) => {
            const { fromSlot, toSlot, itemGroup } = event as EquipItemPayload;
            
            if (!(itemGroup.getItem() instanceof WereableItem)) return;
                const item = itemGroup.getItem() as WereableItem;
                // Verificar si el slot es válido
                if (!SlotValidator.isValidSlot(item.getSlot(), toSlot)) {
                    return;
                }
                
                this.player.swapEquipment(fromSlot, toSlot, itemGroup);
        });
    }
    
    handleRemoveEquipment() {
        this.gameHandler.on(HudPlayerEvents.HUD_PLAYER_UNEQUIP_ITEM, (event: unknown) => {
            const { fromSlot, itemGroup } = event as UnequipItemPayload;
            
            this.player.getEquipment().removeEquipment(fromSlot);
            const emptySlot = this.player.getInventory().findFirstEmptySlot();
            if (emptySlot !== null) {
                this.player.getInventory().addItemToSlot(itemGroup.getItem().getId(), itemGroup.getQuantity(), emptySlot);
            }
            this.player.removeEquipmentStats(itemGroup);

            
            this.updatePlayerInfoHud();
        });
    }

    handleNpcAttack() {
        this.levelEventHandler.on("npc-attack", ({ pos, range, damage, from}) => {
            let diff = this.player.pos.sub(pos);
            if (diff.distance() > range) {
                return;
            }
            const healthAfterDamage = this.player.receiveDamage(damage, from);
            this.player.updateHealth(healthAfterDamage);
        });
    }

    handleMonsterRewards() {
        this.levelEventHandler.on("npc-aggresive-died", ({ actor, rewards}) => {
            if(this.player.name === actor.name) {
            if(rewards.exp) {
                this.player.updateExp(rewards.exp);
                
            }
            }
        });
    }
    handleAttackEvent(attackData:{ range: number, type: AttackType, element: ElementType,  damage: number, damageType: DamageType }) {
        const data: Attack = {
            from: this.player,
            pos: this.player.pos,
            direction: this.player.getDirection(),
            ...attackData,
        }
        this.levelEventHandler.emit(`player-attack`, data);
    }

    updateHealthOnHud(health: number) {
        this.gameHandler.emit(HudPlayerEvents.HUD_PLAYER_REMAINING_HP, {remainingHP: health});
    }

    updateStatsOnHud(stats: ActorStats) {
        this.gameHandler.emit(HudPlayerEvents.HUD_PLAYER_STATS_UPDATE, {stats});
    }

    updatePlayerInfoHud() {
        const data = {
            nickname: this.player.name,
            stats: this.player.getStats(),
            equipment: this.player.getEquipment().equipment,
            equipmentSlots: this.player.getEquipment().equipmentSlots,
            totalHP: this.player.getMaxHealth(),
            remainingHP: this.player.getHealth()
        };

        this.gameHandler.emit(HudPlayerEvents.HUD_PLAYER_INFO_UPDATE, data);
    }

    sendPlayerDead(resetPlayer: () => void) {
        this.gameHandler.emit(HudPlayerEvents.HUD_PLAYER_HEALTH_DEPLETED, { onRevive: resetPlayer });
    }

    toggleInventory() {
        this.toggleHUD(HudPlayerEvents.HUD_PLAYER_TOGGLE_INVENTORY);
    }

    toggleProfile() {
        this.toggleHUD(HudPlayerEvents.HUD_PLAYER_TOGGLE_PROFILE);
    }

    private toggleHUD(event: HudPlayerEvents) {
        this.gameHandler.emit(event, {});
    }
}

export default PlayerEventsHandler;