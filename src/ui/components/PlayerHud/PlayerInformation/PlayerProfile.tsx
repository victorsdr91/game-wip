import { HudPlayerEvents } from "state/helpers/PlayerEvents";
import GameWindow from "../../Common/GameWindow";
import usePlayerInfo from "ui/clientState/providers/PlayerInfoProvider/usePlayerInfo";
import SlotsGrid from "./SlotsGrid";
import EquipmentInSlots from "./EquipmentInSlots";

const PlayerProfile = () => {

    const { nickname, level, stats, equipment, equipmentSlots } = usePlayerInfo();

    const windowHeader = () => {
        const name = `Level ${level} - ${nickname}`;
        return (<>{name}</>);
    }

    const calculateEquipmentDimensions = () => {
        const positions = Array.from(equipmentSlots.values());
        if (positions.length === 0) return { width: 0, height: 0 };

        const maxX = Math.max(...positions.map(p => p.x));
        const maxY = Math.max(...positions.map(p => p.y));

        // Añadir el tamaño del último slot
        return {
            width: maxX + 32,  // 32 = tamaño del slot
            height: maxY + 32
        };
    };

    const dimensions = calculateEquipmentDimensions();

    return (
        <GameWindow
            windowHeader={windowHeader()}
            playerEvent={HudPlayerEvents.HUD_PLAYER_TOGGLE_PROFILE}
            initialPosition={{
                x: 250,
                y: 150,
            }}>
            <div id="player-info-body" className="relative my-2" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
                <SlotsGrid 
                    equipment={equipment}
                    equipmentSlots={equipmentSlots}
                />
                <EquipmentInSlots
                    equipment={equipment}
                    equipmentSlots={equipmentSlots}
                />
            </div>
            <div id="player-info-footer" className="flex flex-col justify-between border-t-2 border-t-amber-950 pt-2">
                <h1 className="mb-2">Stats</h1>
                <div className="flex flex-row gap-3 p-2 bg-amber-950 text-amber-100 rounded-sm">
                    <div className="flex flex-col gap-1 border-r-[1px] border-e-amber-900 border-dashed pr-2">
                        <div>STR: {stats.f_attack}</div>
                        <div>CON: {stats.con}</div>
                        <div>AGI: {stats.agi}</div>
                        <div>PDEF: {stats.f_defense}</div>
                    </div>
                    <div className="flex flex-col gap-1 border-r-[1px] border-e-amber-900 border-dashed pr-2">
                        <div>INT: {stats.m_attack}</div>
                        <div>CSPEED: {stats.cSpeed}</div>
                        <div>SPEED: {stats.speed}</div>
                        <div>MDEF: {stats.m_defense}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div>Physical Damage: {stats.f_damage}</div>
                        <div>Magical Damage: {stats.m_damage}</div>
                        <div>Critical Rate: {stats.critical_rate}%</div>
                    </div>
                </div>
            </div>
        </GameWindow>
    );
};

export default PlayerProfile;