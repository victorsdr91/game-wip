const PlayerDeadPopup = () => {
    return (
    <div id="player-dead-popup" className="excalibur-scale font-[PublicPixel] hide player-dead-banner p-3 bg-amber-900 text-amber-200 text-xs border-amber-950 border-3 rounded-md">
        <div className="p-2">You have lost</div>
        <button id="player-revive-button" className="block p-2 m-auto hover:bg-amber-950 border bg-amber-800 rounded-md">Revive</button>
    </div>
    );
}
export default PlayerDeadPopup;