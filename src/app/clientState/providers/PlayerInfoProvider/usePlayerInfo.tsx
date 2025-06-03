import { useContext } from 'react';
import PlayerInfoContext from './PlayerInfoContext';

const usePlayerInfo = () => {
    return useContext(PlayerInfoContext);
}

export default usePlayerInfo;
