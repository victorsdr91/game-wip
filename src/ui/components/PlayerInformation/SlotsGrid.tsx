import { FC } from "react";
import { EquipmentSlotsType, EquipmentType } from "model/Player/contract";

const SlotsGrid: FC<{equipmentSlots: EquipmentSlotsType, equipment: EquipmentType}> = ({ equipment, equipmentSlots }) => {
    return (
        <div className="absolute inset-0">
            {Array.from(equipmentSlots.entries()).map(([slotId, position]) => (
                <div 
                    key={`pslot-${slotId}`}
                    className={`absolute w-8 h-8 border ${
                        slotId in equipment 
                            ? 'border-amber-950 opacity-25' 
                            : 'border-amber-800 opacity-55'
                    }`}
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        pointerEvents: 'none' // Importante: permite que los eventos pasen a través
                    }}
                > {slotId} </div>
            ))}
        </div>
    )
};

export default SlotsGrid;