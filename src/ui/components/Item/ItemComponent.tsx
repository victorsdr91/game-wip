import { WereableItem } from "model/Item/WereableItem";
import Draggable from "../Common/Draggable";
import { ItemComponentProps } from "./contract";

const ItemComponent: React.FC<ItemComponentProps> = ({ itemGroup, position, dimensions, onDragEnd, onRightClick }) => {
    const item = itemGroup.getItem();
    let itemStats: string[] = [];
    if(item.getStats?.()){
       itemStats = Object.keys(item.getStats());
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (item instanceof WereableItem && onRightClick) {
            onRightClick(itemGroup);
        }
    };
    
    return (
       <Draggable 
            initialPos={position}
            onDragEnd={onDragEnd}
            className="absolute"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                zIndex: 20
            }}
        >
                <div 
                    className="flex flex-col items-center justify-center border-amber-950 border-2 rounded-sm w-full h-full group"
                    onContextMenu={handleContextMenu}
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

export default ItemComponent;