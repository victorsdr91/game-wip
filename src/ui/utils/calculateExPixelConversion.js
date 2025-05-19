"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExPixelConversion = void 0;
const excalibur_1 = require("excalibur");
const calculateExPixelConversion = (screen) => {
    const origin = screen.worldToPageCoordinates(excalibur_1.Vector.Zero);
    const singlePixel = screen.worldToPageCoordinates(new excalibur_1.Vector(1, 0)).sub(origin);
    const pixelConversion = singlePixel.x;
    document.documentElement.style.setProperty('--pixel-conversion', pixelConversion.toString());
};
exports.calculateExPixelConversion = calculateExPixelConversion;
