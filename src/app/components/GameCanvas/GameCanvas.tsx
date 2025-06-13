import React, { useRef } from 'react';

const GameCanvas = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    
    return (
        <canvas id="game"></canvas>
    );
}

export default GameCanvas;