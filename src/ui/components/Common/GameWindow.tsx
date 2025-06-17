import React, { FC, useState } from "react";
import Draggable from "../Common/Draggable";
import { useGameEvent } from "ui/clientState/hooks/useGameEvent/useGameEvent";
import { Coordinates, GameWindowProps } from "./contract";

const GameWindow: FC<GameWindowProps> = ({ windowHeader, initialPosition, playerEvent, children, show = false }) => {
    const [showWindow, setShowWindow] = useState<boolean>(show);
    const [windowPosition, setWindowPosition] = useState<Coordinates>(initialPosition);

    const windowPositionDragEnd = (newPosition: Coordinates) => {
        setWindowPosition(newPosition);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.window-header') || target.closest('.close-window')) {
            e.stopPropagation();
        }
    };

    const onCloseWindow = (e: React.MouseEvent) => {
        setShowWindow(false);
    };

    if(playerEvent) {
        useGameEvent({
            event: playerEvent,
            callback: () => {
                setShowWindow(!showWindow);
            }
        });
    }

    return (
        <Draggable
            initialPos={windowPosition}
            onDragEnd={windowPositionDragEnd}
            className="absolute"
            style={{
                left: `${windowPosition.x}px`,
                top: `${windowPosition.y}px`,
                zIndex: 1
            }}
            >
                <div 
                    className={`${showWindow ? "block" : "hidden"} p-3 bg-amber-900 text-amber-200 text-[8px] border-amber-950 border-3 rounded-md cursor-default`}
                    onMouseDown={onMouseDown}
                >
                    <div className="window-header flex flex-row justify-between border-b-2 border-b-amber-950 pb-1 cursor-grab">
                        <div className="flex p-1">{ windowHeader }</div>
                        <div className="flex"><button className="close-window py-1 px-2 rounded-xs bg-amber-800 border-amber-700 border-[1px] cursor-pointer" onClick={onCloseWindow} >X</button></div>
                    </div>
                    {children}
                </div>
        </Draggable>
    );
};

export default GameWindow;