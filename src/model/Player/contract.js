"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animationDirection = exports.animationMode = void 0;
;
var animationMode;
(function (animationMode) {
    animationMode["IDLE"] = "idle";
    animationMode["WALK"] = "walk";
    animationMode["RUN"] = "run";
    animationMode["DAMAGED"] = "damaged";
    animationMode["DIE"] = "die";
})(animationMode || (exports.animationMode = animationMode = {}));
var animationDirection;
(function (animationDirection) {
    animationDirection["UP"] = "up";
    animationDirection["DOWN"] = "down";
    animationDirection["LEFT"] = "left";
    animationDirection["RIGHT"] = "right";
})(animationDirection || (exports.animationDirection = animationDirection = {}));
