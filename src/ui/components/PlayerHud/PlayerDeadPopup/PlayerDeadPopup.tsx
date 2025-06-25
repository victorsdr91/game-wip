import { useCallback, useEffect, useState } from "react";
import usePlayerInfo from "ui/clientState/providers/PlayerInfoProvider/usePlayerInfo";

const PlayerDeadPopup = () => {
    const { isDead, isDeadPopupCallback } = usePlayerInfo();
    const [ showPopup, setShowPopup ] = useState(isDead ? "show" : "hide");

    const onRevive = useCallback(() => {
        setShowPopup("hide");
        isDeadPopupCallback();
    }, [isDeadPopupCallback]);

    useEffect(() => {
        setShowPopup(isDead ? "show" : "hide");
    }, [isDead]);
    
    const popupClassList = `excalibur-scale font-[PublicPixel] ${showPopup} player-dead-banner p-3 bg-amber-900 text-amber-200 text-xs border-amber-950 border-3 rounded-md`

    return (
    <div className={popupClassList}>
        <div className="p-2">You are dead. Be careful with the monsters</div>
        <button id="player-revive-button" onClick={onRevive} className="block p-2 m-auto hover:bg-amber-950 border bg-amber-800 rounded-md">Revive</button>
    </div>
    );
}
export default PlayerDeadPopup;