// NumberGrid.tsx
import React from 'react';
import styles from './NumberGrid.module.css';

interface NumberGridProps {
numbers: number[];
scaryIndices: number[];
selectedIndices: number[];
onNumberClick: (index: number) => void;
}

const NumberGrid: React.FC<NumberGridProps> = ({
numbers,
scaryIndices,
selectedIndices,
onNumberClick,
}) => {
return (
    <div className={styles.gridContainer}>
    {numbers.map((num, index) => {
        const isScary = scaryIndices.includes(index);
        const isSelected = selectedIndices.includes(index);

        // Combine style classes
        const className = `
        ${styles.numberCell}
        ${isScary ? styles.scaryAnimation : ''}
        ${isSelected ? styles.selected : ''}
        `;

        return (
        <div
            key={index}
            className={className}
            onClick={() => onNumberClick(index)}
        >
            {num}
        </div>
        );
    })}
    </div>
);
};

export default NumberGrid;
