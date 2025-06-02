
import React from 'react';
const PlayerNameplate = () => { 
    return (
      <div id="player-info-hud" className="player-info p-2 border-amber-950 border-2 rounded-md">
        <h3 className="p-1">[lvl <span id="player-level" className="text-amber-300">1</span>] <span id="player-nickname">TrianMARC</span></h3>
        <div id="hp-ui">
          <div id="hp-bar" className="w-full border border-amber-950 bg-amber-700 rounded-md">
            <div id="remaining-hp" className="bg-green-500 p-1 rounded-md">
              <div id="hp-points" className="absolute w-full text-center">
                <span id="remaining-hp-points">50</span>/<span id="total-hp-points">100</span>
              </div>
              <h4 className="">HP:</h4>
            </div>
          </div>
        </div>
      </div>
    );
}
export default PlayerNameplate;
