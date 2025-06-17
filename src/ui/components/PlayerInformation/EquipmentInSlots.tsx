import { SlotType } from "model/Player/types/SlotType.enum";
import ItemComponent from "../Item/ItemComponent";
import { EquipmentSlotsType, EquipmentType } from "model/Player/contract";
import { ItemGroup } from "model/Item/ItemGroup";
import { HudPlayerEvents } from "state/helpers/PlayerEvents";
import { Game } from "services/Game";
import { useInventory } from "ui/clientState/providers/PlayerItemHandler/InventoryProvider";
import { FC } from "react";

export interface EquipmentInSlotsProps {
    equipment: EquipmentType;
    equipmentSlots: EquipmentSlotsType;
}

const EquipmentInSlots: FC<EquipmentInSlotsProps> = ({ equipment, equipmentSlots}) => {
    const { findInventorySlot } = useInventory();

    const handleItemDrop = (fromSlot: SlotType,  itemGroup: ItemGroup) => {             
        Game.getInstance().emit(HudPlayerEvents.HUD_PLAYER_UNEQUIP_ITEM, {
            fromSlot,
            toSlot: findInventorySlot(itemGroup),
            itemGroup
        });
    };

    return (<>{  Object.entries(equipment).map(([slotType, itemGroup]) => {
                    const position = equipmentSlots.get(slotType as SlotType) || { x: 0, y: 0};
                    return (<ItemComponent 
                                key={`equipment-${slotType}`}
                                itemGroup={itemGroup}
                                position={position}
                                dimensions={{
                                    width: 32,
                                    height: 32,
                                    gap: 8
                                }}
                                onRightClick={() => handleItemDrop(slotType as SlotType, itemGroup)}
                            />);

                })}</>);
}

export default EquipmentInSlots;