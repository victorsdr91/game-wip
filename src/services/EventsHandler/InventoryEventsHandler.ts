import { EventEmitter } from "excalibur";
import EventsHandler from "./EventsHandler";
import { Inventory } from "model/Inventory/Inventory";
import { HudPlayerEvents, InventoryEventPayload } from "state/helpers/PlayerEvents";

class InventoryEventsHandler extends EventsHandler {
    private inventory: Inventory;

    constructor({ inventory, eventEmitter }: {inventory: Inventory, eventEmitter?: EventEmitter}) {
        super(eventEmitter);
        this.inventory = inventory;
    }

    initialize() {
        this.handleItemMoved();
        this.handleItemDropped();
    }

    handleItemMoved() {
        this.gameHandler.on(HudPlayerEvents.HUD_PLAYER_INVENTORY_ITEM_MOVED, (event: unknown) => {
            const { fromSlot, toSlot } = event as { 
                fromSlot: number;
                toSlot: number;
            };
            this.inventory.updateItemPosition(fromSlot, toSlot);
        });
    }

    handleItemDropped() {
        this.gameHandler.on(HudPlayerEvents.HUD_PLAYER_INVENTORY_ITEM_DROPPED, (event: unknown) => {
            const { fromSlot } = event as { fromSlot: number };
            this.inventory.removeItem(fromSlot);
        });
    }

    public emitInventoryUpdate(): void {
        const inv = this.inventory;
        const payload: InventoryEventPayload = {
            slots: inv.getSlots(),
            maxWeight: inv.getWeightLimit(),
            currentWeight: inv.getCurrentWeight(),
            items: inv.getItems(),
            itemPositions: inv.getItemPositions(),
            findFirstEmptySlot: () => { return inv.findFirstEmptySlot() },
        };
        
        this.gameHandler.emit(HudPlayerEvents.HUD_PLAYER_INVENTORY_UPDATE, payload);
    }

    
}

export default InventoryEventsHandler;