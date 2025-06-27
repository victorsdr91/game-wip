

import usePlayerInfo from 'ui/clientState/providers/PlayerInfoProvider/usePlayerInfo';
import React from 'react';
const PlayerNameplate = () => {
  
  const { nickname, level, remainingHP, totalHP } = usePlayerInfo();


  const hpBarStyle = {
    width: `${remainingHP/totalHP*100}%`,
  };

  return (
    <div className="player-info p-2 border-amber-950 bg-amber-900 border-2 rounded-md w-[300px]">
      <h3 className="p-1">[lvl <span className="text-amber-300">{level}</span>] { nickname }</h3>
      <div>
        <div className="w-full border border-amber-950 bg-amber-700 rounded-md">
          <div className="bg-green-500 p-1 rounded-md" style={hpBarStyle}>
            <h4 className='inline'>HP:</h4>
            <div className="absolute inline-block w-[200px] text-center">
              { remainingHP }/{ totalHP }
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
export default PlayerNameplate;
