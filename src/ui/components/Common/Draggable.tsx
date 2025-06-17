import React, { useState, useEffect, useRef, useCallback, FC } from "react";

const getPixelRatio = (): number => {
    const ratio = getComputedStyle(document.documentElement)
      .getPropertyValue('--pixel-conversion');
    return parseFloat(ratio) || 1;
  };

interface DraggableProps {
    children: React.ReactNode;
    initialPos: { x: number; y: number };
    onDragEnd?: (position: { x: number; y: number }) => void;
    className?: string;
    style?: React.CSSProperties;
}

const Draggable: FC<DraggableProps> = ({ children, initialPos, onDragEnd, className, style }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const pixelRatio = getPixelRatio();

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!dragRef.current || e.button !== 0) return;

        const rect = dragRef.current.getBoundingClientRect();
        const parentRect = dragRef.current.parentElement?.getBoundingClientRect();
        
        if (!parentRect) return;

        // Calcular el offset relativo al contenedor padre
        offsetRef.current = {
            x: (e.clientX - rect.left)/ pixelRatio,
            y: (e.clientY - rect.top)/ pixelRatio
        };

        // Guardar la posición inicial relativa al contenedor padre
        startPosRef.current = {
            x: (e.clientX - parentRect.left) / pixelRatio,
            y: (e.clientY - parentRect.top)/ pixelRatio
        };
        
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !dragRef.current) return;

        const parent = dragRef.current.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        
        // Calcular la nueva posición relativa al contenedor padre
        const newX = (e.clientX - parentRect.left) / pixelRatio - startPosRef.current.x;
        const newY = (e.clientY - parentRect.top) / pixelRatio - startPosRef.current.y ;

        // Aplicar la transformación basada en el desplazamiento desde la posición inicial
        dragRef.current.style.transform = `translate(${newX }px, ${newY }px)`;
        e.preventDefault();
    }, [isDragging]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (!isDragging || !dragRef.current) return;

        const parent = dragRef.current.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        
        // Calcular la posición final relativa al contenedor padre
        const finalX = (e.clientX - parentRect.left ) / pixelRatio - startPosRef.current.x;
        const finalY = (e.clientY - parentRect.top ) / pixelRatio - startPosRef.current.y;

        dragRef.current.style.transform = '';
        setIsDragging(false);

        if (onDragEnd) {
            onDragEnd({
                x: initialPos.x + finalX,
                y: initialPos.y + finalY
            });
        }

        e.preventDefault();
    }, [isDragging, initialPos, onDragEnd]);


    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={dragRef}
            className={`${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
                ...style,
                position: 'absolute',
                userSelect: 'none',
                touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
};

export default Draggable;