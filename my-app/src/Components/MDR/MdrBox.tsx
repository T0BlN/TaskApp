import React from 'react';
import styles from './MdrBox.module.css';

interface MdrBoxProps {
index: number;
fill: number;
isChosen: boolean;
boxOpen: boolean;
boxClosing: boolean;
}

const MdrBox: React.FC<MdrBoxProps> = ({
index,
fill,
isChosen,
boxOpen,
boxClosing,
}) => {
let leftHalfClass = styles.barHalfLeft;
let rightHalfClass = styles.barHalfRight;

if (boxOpen && !boxClosing) {
    leftHalfClass += ' ' + styles.barHalfLeftOpen;
    rightHalfClass += ' ' + styles.barHalfRightOpen;
} else if (boxClosing) {
    leftHalfClass += ' ' + styles.barHalfLeftClose;
    rightHalfClass += ' ' + styles.barHalfRightClose;
}

return (
    <div className={styles.boxContainer}>
    <div className={styles.barWrapper}>
        <div className={leftHalfClass} />
        <div className={rightHalfClass} />
    </div>

    <div className={styles.box}>
        <div className={styles.label}>{`0${index + 1}`.slice(-2)}</div>

        <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
            <div
            className={styles.progressFill}
            style={{ width: `${fill}%` }}
            />
        </div>
        <div className={styles.progressPercent}>{fill}%</div>
        </div>

        {isChosen && <div className={styles.chosenOverlay}></div>}
    </div>
    </div>
);
};

export default MdrBox;
