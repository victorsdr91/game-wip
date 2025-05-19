"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = void 0;
const excalibur_1 = require("excalibur");
const resources_1 = require("./resources");
const Level_1 = require("./scenes/Level1/Level");
const MainMenu_1 = require("./scenes/MainMenu/MainMenu");
const contract_1 = require("./scenes/Level1/contract");
const keyboard_json_1 = __importDefault(require("../public/config/keyboard.json"));
const Config_1 = require("./state/Config");
const calculateExPixelConversion_1 = require("./ui/utils/calculateExPixelConversion");
class Game extends excalibur_1.Engine {
    constructor(worldInfo, config) {
        super({
            width: 1366,
            height: 768,
            pixelArt: true,
            displayMode: excalibur_1.DisplayMode.FitScreen
        });
        this.worldInfo = worldInfo;
        this.config = config;
    }
    initialize() {
        Config_1.Config.setControls(this.config.controls);
        const mainWorld = new Level_1.Level(this.worldInfo);
        this.addScene('mainmenu', new MainMenu_1.MainMenu());
        this.addScene('worldScene', mainWorld);
        this.start(resources_1.loader).then(() => {
            this.goToScene('mainmenu').then(() => {
                console.log(this.currentSceneName);
            });
        });
    }
}
const playerInfo = {
    nickname: "TrianMARC",
    position: new excalibur_1.Vector(123, 485),
    zIndex: 8,
    progress: {
        exp: 0,
        expNextLevel: 100,
    },
    stats: {
        level: 1,
        f_attack: 10,
        f_defense: 12,
        m_attack: 5,
        m_defense: 10,
        speed: 3,
        cSpeed: 2,
        agi: 2,
        con: 20
    }
};
const generateMonster = (x, y) => {
    return {
        npcName: "Slime",
        pos: { x, y, z: 9 },
        health: 100,
        sprite: "monster_001",
        spriteSize: {
            width: contract_1.spriteSize.small,
            height: contract_1.spriteSize.small
        },
        type: contract_1.NPCTypes.AGRESSIVE,
        rewards: {
            exp: 100,
        },
        stats: {
            level: 2,
            f_attack: 10,
            f_defense: 2,
            m_attack: 2,
            m_defense: 2,
            speed: 3,
            cSpeed: 2,
            agi: 2,
            con: 2
        }
    };
};
const config = {
    controls: {
        keyboard: keyboard_json_1.default,
    }
};
const npcList = new Array();
for (let i = 0; i < 5; i++) {
    npcList.push(generateMonster(491 + Math.random() * 132, 203 + Math.random() * 258));
}
const worldInfo = {
    playerInfo,
    npcList
};
exports.game = new Game(worldInfo, config);
exports.game.screen.events.on('resize', () => (0, calculateExPixelConversion_1.calculateExPixelConversion)(exports.game.screen));
exports.game.showDebug(true);
exports.game.start(resources_1.loader).then(() => {
    (0, calculateExPixelConversion_1.calculateExPixelConversion)(exports.game.screen);
});
exports.game.initialize();
