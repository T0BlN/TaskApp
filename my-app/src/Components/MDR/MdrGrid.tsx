// components/MdrGrid.tsx
import React, { useRef, useState, useEffect } from 'react';
import styles from './MdrGrid.module.css';

interface MdrGridProps {
numbers: number[];
rowCount: number;
colCount: number;
clickedIndices: Set<number>;
scaryIndices: number[];
onNumberClick: (index: number) => void;
flyAnimationTriggered: boolean;
}

const MdrGrid: React.FC<MdrGridProps> = ({
numbers,
rowCount,
colCount,
clickedIndices,
scaryIndices,
onNumberClick,
flyAnimationTriggered,
}) => {
const containerRef = useRef<HTMLDivElement | null>(null);

// For click-drag panning
const [isDragging, setIsDragging] = useState(false);
const [dragStart, setDragStart] = useState<{x: number, y: number}>({x: 0, y: 0});
const [scrollStart, setScrollStart] = useState<{x: number, y: number}>({x: 0, y: 0});

// For hover-enlarge effect
const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });

useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setScrollStart({ x: container.scrollLeft, y: container.scrollTop });
    };

    const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    container.scrollLeft = scrollStart.x - dx;
    container.scrollTop = scrollStart.y - dy;
    };

    const handleMouseUp = () => {
    setIsDragging(false);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
    container.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    };
}, [isDragging, dragStart, scrollStart]);

// Render each number
const gridItems = numbers.map((num, index) => {
    const row = Math.floor(index / colCount);
    const col = index % colCount;

    // A unique random animation duration + delay for wiggle
    const duration = (1.5 + Math.random() * 1.5).toFixed(2) + 's';
    const delay = (Math.random() * 2).toFixed(2) + 's';

    // Distance-based scaling
    // We find the center of this cell in the container, then compute distance from mouse
    const cellSize = 48; // consistent with CSS .cell width/height
    const cellX = col * cellSize + cellSize / 2;
    const cellY = row * cellSize + cellSize / 2;

    let scale = 1;
    // We'll check bounding rect to get container offset
    if (containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = cellX - containerRef.current.scrollLeft + rect.left;
    const centerY = cellY - containerRef.current.scrollTop + rect.top;
    const dist = Math.hypot(mousePos.x - centerX, mousePos.y - centerY);
    const maxDist = 100; // radius for the enlarge effect
    if (dist < maxDist) {
        scale = 1.0 + (0.8 * (1 - dist / maxDist)); 
    }
    }

    // If this index is in the “scary” group and fly animation is triggered, add a special class
    let flyClass = '';
    if (flyAnimationTriggered && scaryIndices.includes(index)) {
    flyClass = styles.flyDown;
    }

    return (
    <div
        key={index}
        className={`${styles.cell} ${flyClass}`}
        style={{
        top: row * cellSize,
        left: col * cellSize,
        animationDuration: duration,
        animationDelay: delay,
        transform: `scale(${scale})`,
        }}
        onClick={() => onNumberClick(index)}
    >
        {num}
    </div>
    );
});

return (
    <div className={styles.container} ref={containerRef}>
    <div
        className={styles.grid}
        style={{
        width: colCount * 48,
        height: rowCount * 48,
        }}
    >
        {gridItems}
    </div>
    </div>
);
};

export default MdrGrid;
