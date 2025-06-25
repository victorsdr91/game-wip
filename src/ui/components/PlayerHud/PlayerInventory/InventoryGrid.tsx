import { FC } from "react";
import { Inventory } from "./contract";

const InventoryGrid: FC<{inventory: Inventory}> = ({ inventory }) => {
    return (
        <div className="absolute inset-0">
            {Array.from(inventory.itemPositions.entries()).map(([slotId, position]) => (
                <div 
                    key={`slot-${slotId}`}
                    className={`absolute w-8 h-8 border ${
                        inventory.items.has(slotId) 
                            ? 'border-amber-950 opacity-10' 
                            : 'border-amber-800 opacity-25'
                    }`}
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        pointerEvents: 'none' // Importante: permite que los eventos pasen a través
                    }}
                />
            ))}
        </div>
    )
};

export default InventoryGrid