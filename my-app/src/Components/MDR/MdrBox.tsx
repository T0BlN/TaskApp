// components/MdrBox.tsx
import React from 'react';
import styles from './MdrBox.module.css';

interface MdrBoxProps {
index: number;
fill: number; // 0 to 100
}

const MdrBox: React.FC<MdrBoxProps> = ({ index, fill }) => {
return (
    <div className={styles.box}>
    <div className={styles.label}>{`0${index + 1}`.slice(-2)}</div>
    <div className={styles.fillBar}>
        <div
        className={styles.fill}
        style={{ width: `${fill}%` }}
        />
    </div>
    <div className={styles.fillPercent}>{fill}%</div>
    </div>
);
};

export default MdrBox;
