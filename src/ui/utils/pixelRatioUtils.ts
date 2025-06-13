import { Vector } from "excalibur";

export const calculateExPixelConversion = (screen: ex.Screen) => {
  const origin = screen.worldToPageCoordinates(Vector.Zero);
  const singlePixel = screen.worldToPageCoordinates(new Vector(1, 0)).sub(origin);
  const pixelConversion = singlePixel.x;
  document.documentElement.style.setProperty('--pixel-conversion', pixelConversion.toString());
}


export const getPixelRatio = () => {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pixel-conversion')) || 1;
};

export const convertToGamePosition = (position: { x: number, y: number }) => {
    const ratio = getPixelRatio();
    return {
        x: position.x / ratio,
        y: position.y / ratio
    };
};

export const convertToScreenPosition = (position: { x: number, y: number }) => {
    const ratio = getPixelRatio();
    return {
        x: position.x * ratio,
        y: position.y * ratio
    };
};