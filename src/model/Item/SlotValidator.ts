import { SlotType } from "model/Player/types/SlotType.enum";

export class SlotValidator {
    static isValidSlot(itemSlot: SlotType, targetSlot: SlotType): boolean {
        if (!itemSlot || !targetSlot) {
            return false;
        }

        if (itemSlot === SlotType.RING) {
            return targetSlot === SlotType.RING_1 || targetSlot === SlotType.RING_2;
        }

        return itemSlot === targetSlot;
    }

    static getRingSlots(): SlotType[] {
        return [SlotType.RING_1, SlotType.RING_2];
    }

    static isRingSlot(slot: SlotType): boolean {
        return this.getRingSlots().includes(slot);
    }
}