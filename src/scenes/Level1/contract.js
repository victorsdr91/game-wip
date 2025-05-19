"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spriteSize = exports.NPCTypes = void 0;
;
var NPCTypes;
(function (NPCTypes) {
    NPCTypes["PACIFIC"] = "pacific";
    NPCTypes["AGRESSIVE"] = "agressive";
})(NPCTypes || (exports.NPCTypes = NPCTypes = {}));
var spriteSize;
(function (spriteSize) {
    spriteSize[spriteSize["medium"] = 32] = "medium";
    spriteSize[spriteSize["small"] = 16] = "small";
    spriteSize[spriteSize["big"] = 64] = "big";
})(spriteSize || (exports.spriteSize = spriteSize = {}));
