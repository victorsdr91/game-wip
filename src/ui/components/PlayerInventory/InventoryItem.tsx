import Draggable from "../Common/Draggable";
import { InventoryItemProps } from "./contract";

const InventoryItem: React.FC<InventoryItemProps> = ({ itemGroup, position, dimensions, onDragEnd }) => {
    const item = itemGroup.getItem();
    let itemStats: string[] = [];
    if(item.getStats?.()){
       itemStats = Object.keys(item.getStats());
    }
    
    
    return (
       <Draggable 
            initialPos={position}
            onDragEnd={onDragEnd}
            className="absolute"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`
            }}
        >
                <div 
                    className="flex flex-col items-center justify-center border-amber-950 border-2 rounded-sm w-full h-full group"
                    style={{ zIndex: 10 }}
                >
                    <img 
                        src={item.getIcon()?.data.src} 
                        alt={item.getName()} 
                        className="w-full h-full" 
                        draggable={false}
                    />
                    <div className="tooltip hidden group-hover:block absolute bg-amber-800 text-amber-200 p-2 rounded-md z-10 opacity-85 top-full left-0 w-[200px] border-amber-950 border-2 mt-2">
                        <div className="text-[8px] font-bold">{item.getName()}</div>
                        <div className="text-[6px] mb-2">{item.getDescription()}</div>
                        {itemGroup.getQuantity() > 1 && (
                            <div className="text-[6px]">x{itemGroup.getQuantity()}</div>
                        )}
                        {itemStats.map((stat, key) => {
                            return (<div key={key} className="text-[6px] text-green-500">+{item.getStats?.()[stat]} {stat}</div>)
                        }) }
                        <div className="text-[6px]">Weight: {itemGroup.getWeight()}kg</div>
                    </div>
                </div>           
        </Draggable>
    );
};

export default InventoryItem;