import { FC } from "react";
import { Inventory } from "./contract";

const InventoryFooter: FC<{inventory: Inventory}> = ({ inventory }) => {
    return (
        <div className="flex flex-row justify-between border-t-2 border-t-amber-950 pt-2">
            <div className="flex">{inventory.items.size}/{inventory.slots}</div>
            <div className="flex">{inventory.currentWeight}/{inventory.maxWeight} Kg</div>
        </div>
    )
};

export default InventoryFooter