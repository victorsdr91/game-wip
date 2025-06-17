import { FC, useState } from "react";
import GameWindow from "../Common/GameWindow"
import { Coordinates } from "../Common/contract";

interface DropItemPopUpProps {
    callback: (fromSlot: number) => void;
    onClose: () => void;
    dropPopupProps: {
        show: boolean;
        fromSlot: number;
        position: Coordinates;
    };
}

const DropItemPopup: FC<DropItemPopUpProps> = ({ callback, onClose, dropPopupProps: {show, position, fromSlot} }) => {
    
    return (<GameWindow windowHeader={"Do you really want to destroy this item?"} initialPosition={{x: 350, y:250}} show={show}>
        <div className="flex flex-row">
            <button onClick={() => callback(fromSlot)}>Yes</button>
            <button onClick={() => onClose()}>No</button>
        </div>
    </GameWindow>);
};

export default DropItemPopup;