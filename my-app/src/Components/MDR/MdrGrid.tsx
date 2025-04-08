import React, { useRef, useState, useEffect } from 'react';
import styles from './MdrGrid.module.css';

interface MdrGridProps {
    numbers: number[];
    rowCount: number;
    colCount: number;
    scaryIndices: number[];
    selectedIndices: Set<number>;
    setSelectedIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
    numbersDisappearing: boolean;
}

const baseCellSize = 80;
const cellMargin = 1;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.0;

interface WiggleParam {
    duration: string;
    delay: string;
}

const MdrGrid: React.FC<MdrGridProps> = ({
    numbers,
    rowCount,
    colCount,
    scaryIndices,
    selectedIndices,
    setSelectedIndices,
    numbersDisappearing,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [wiggleParams, setWiggleParams] = useState<WiggleParam[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

    const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);
    const [disableHover, setDisableHover] = useState(false);

    useEffect(() => {
        const totalCount = numbers.length;
        const newParams: WiggleParam[] = [];
        for (let i = 0; i < totalCount; i++) {
        newParams.push({
            duration: (1.5 + Math.random() * 1.5).toFixed(2) + 's',
            delay: (Math.random() * 2).toFixed(2) + 's',
        });
        }
        setWiggleParams(newParams);
    }, [numbers]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '+' || e.key === '=') {
            zoomAtCursor(0.2);
        } else if (e.key === '-') {
            zoomAtCursor(-0.2);
        }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [zoomLevel, mousePos]);

    function zoomAtCursor(delta: number) {
        const oldZoom = zoomLevel;
        let newZoom = oldZoom + delta;
        if (newZoom < MIN_ZOOM) newZoom = MIN_ZOOM;
        if (newZoom > MAX_ZOOM) newZoom = MAX_ZOOM;
        if (newZoom === oldZoom) return;

        setDisableHover(true);

        const container = containerRef.current;
        if (!container) {
        setZoomLevel(newZoom);
        requestAnimationFrame(() => setDisableHover(false));
        return;
        }
        const rect = container.getBoundingClientRect();

        const oldBlock = (baseCellSize + cellMargin) * oldZoom;
        const oldW = colCount * oldBlock;
        const oldH = rowCount * oldBlock;

        const mx = mousePos.x - rect.left + container.scrollLeft;
        const my = mousePos.y - rect.top + container.scrollTop;
        const propX = mx / oldW;
        const propY = my / oldH;

        setZoomLevel(newZoom);

        requestAnimationFrame(() => {
            const newBlock = (baseCellSize + cellMargin) * newZoom;
            const newW = colCount * newBlock;
            const newH = rowCount * newBlock;

            const screenX = mousePos.x - rect.left;
            const screenY = mousePos.y - rect.top;

            const newScrollLeft = propX * newW - screenX;
            const newScrollTop = propY * newH - screenY;

            container.scrollLeft = Math.max(0, Math.min(newScrollLeft, newW - container.clientWidth));
            container.scrollTop = Math.max(0, Math.min(newScrollTop, newH - container.clientHeight));

            requestAnimationFrame(() => setDisableHover(false));
        });
    }

    const handleContainerMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSelecting(true);
    };
    const handleContainerMouseUp = () => {
        setIsSelecting(false);
    };

    const cellBlockSize = (baseCellSize + cellMargin) * zoomLevel;
    const contentSize = baseCellSize * zoomLevel;

    function selectScary(index: number) {
        if (!scaryIndices.includes(index)) return;
        setSelectedIndices((prev) => {
        if (prev.has(index)) return prev;
        return new Set([...prev, index]);
        });
    }

    const cellElements = numbers.map((digit, i) => {
        const row = Math.floor(i / colCount);
        const col = i % colCount;
        const isScary = scaryIndices.includes(i);
        const isSelected = selectedIndices.has(i);

        const leftPx = col * cellBlockSize;
        const topPx = row * cellBlockSize;

        let hoverScale = 1;
        if (!disableHover && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const cx = leftPx + contentSize / 2 - containerRef.current.scrollLeft + rect.left;
            const cy = topPx + contentSize / 2 - containerRef.current.scrollTop + rect.top;
            const dist = Math.hypot(mousePos.x - cx, mousePos.y - cy);

            const maxDist = 120;
            if (dist < maxDist) {
                hoverScale = 1 + 1.6 * (1 - dist / maxDist);
            }
        }

        const wiggleClass = isScary ? styles.scaryWiggle : styles.wiggleWrapper;

        let finalScale = hoverScale;
        if (isScary && isSelected) {
            finalScale = Math.max(finalScale, 1.5);
        }

        let flyClass = '';
        if (numbersDisappearing && isScary && isSelected) {
            flyClass = styles.flyAway;
        }

        const { duration, delay } = wiggleParams[i] || { duration: '2s', delay: '0s' };

        const onCellMouseDown = () => {
            if (isScary) selectScary(i);
        };
        const onCellMouseOver = () => {
            if (isSelecting && isScary) selectScary(i);
        };

        const fontSize = 0.3 * contentSize;

        return (
        <div
            key={i}
            className={`${styles.cell} ${flyClass}`}
            style={{
            top: topPx,
            left: leftPx,
            width: contentSize,
            height: contentSize,
            }}
            onMouseDown={onCellMouseDown}
            onMouseOver={onCellMouseOver}
        >
            <div
            className={wiggleClass}
            style={{
                animationDuration: duration,
                animationDelay: delay,
            }}
            >
            <div
                className={styles.scaleWrapper}
                style={{
                transform: `scale(${finalScale})`,
                fontWeight: isScary && isSelected ? 'bold' : 'normal',
                fontSize,
                lineHeight: '1',
                }}
            >
                {digit}
            </div>
            </div>
        </div>
        );
    });

    const totalWidth = colCount * cellBlockSize;
    const totalHeight = rowCount * cellBlockSize;

    return (
        <div
        ref={containerRef}
        className={styles.container}
        onMouseDown={handleContainerMouseDown}
        onMouseUp={handleContainerMouseUp}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => {
            setMousePos({ x: -9999, y: -9999 });
            setIsSelecting(false);
        }}
        >
        <div
            className={styles.grid}
            style={{
            position: 'relative',
            width: totalWidth,
            height: totalHeight,
            }}
        >
            {cellElements}
        </div>
        </div>
    );
};

export default MdrGrid;
