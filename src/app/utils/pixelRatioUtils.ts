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