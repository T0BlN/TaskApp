// Box.tsx
import React from 'react';
import styles from './Box.module.css';

interface BoxProps {
boxIndex: number;
fillPercentage: number;
onPlaceNumbers: (boxIndex: number) => void;
}

const Box: React.FC<BoxProps> = ({ boxIndex, fillPercentage, onPlaceNumbers }) => {
const isFull = fillPercentage >= 100;

const handleClick = () => {
    if (!isFull) {
    onPlaceNumbers(boxIndex);
    }
};

// Example of using boxIndex to style differently for each temperament
const temperamentClass = [styles.tempOne, styles.tempTwo, styles.tempThree, styles.tempFour][boxIndex] || '';

return (
    <div className={`${styles.box} ${temperamentClass}`} onClick={handleClick}>
    <div className={styles.fill} style={{ height: `${fillPercentage}%` }} />
    <div className={styles.label}>Box {boxIndex + 1}: {fillPercentage}%</div>
    {isFull && <div className={styles.fullIndicator}>Full</div>}
    </div>
);
};

export default Box;
