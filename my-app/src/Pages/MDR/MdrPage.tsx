// pages/MdrPage.tsx
import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import MdrGrid from '../../Components/MDR/MdrGrid';
import MdrBoxes from '../../Components/MDR/MdrBoxes';
import styles from './MdrPage.module.css'

const MdrPage: React.FC = () => {
const { mdrData, setMdrData, resetMdrData } = useContext(TaskContext)!;
const { boxFillPercentages, currentBoxIndex, isComplete } = mdrData;

// We'll generate a grid of (rowCount * colCount) random numbers
const rowCount = 10;
const colCount = 20;
const totalCount = rowCount * colCount;

// Store the random numbers in a single array
const [numbers, setNumbers] = useState<number[]>([]);
// Track which indices are “scary”
const [scaryIndices, setScaryIndices] = useState<number[]>([]);
// Track which indices have been “clicked” (selected)
const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());

// For the “fly into box” animation
const [flyAnimationTriggered, setFlyAnimationTriggered] = useState<boolean>(false);

// Generate new random numbers + new “scary group”
const generateNumbers = () => {
    const newNums: number[] = [];
    for (let i = 0; i < totalCount; i++) {
    newNums.push(Math.floor(Math.random() * 9999)); 
    }
    setNumbers(newNums);

    // pick a random contiguous set of ~5-10 numbers for “scary group”
    const groupStart = Math.floor(Math.random() * (totalCount - 10));
    const groupSize = 5 + Math.floor(Math.random() * 5);
    const newScaryIndices: number[] = [];
    for (let i = 0; i < groupSize; i++) {
    newScaryIndices.push(groupStart + i);
    }
    setScaryIndices(newScaryIndices);
    setClickedIndices(new Set());
    setFlyAnimationTriggered(false);
};

// On mount, generate the initial set
useEffect(() => {
    generateNumbers();
}, []);

// When the user clicks a number
const handleNumberClick = (index: number) => {
    // Add index to clickedIndices
    setClickedIndices((prev) => {
    const newSet = new Set(prev);
    newSet.add(index);
    return newSet;
    });
};

// Whenever “clickedIndices” changes, check if user has found all scary numbers
useEffect(() => {
    if (scaryIndices.length > 0 && scaryIndices.every((i) => clickedIndices.has(i))) {
    // Trigger “fly into box” animation
    setFlyAnimationTriggered(true);
    // Wait for the animation to finish, then update the box fill
    const timer = setTimeout(() => {
        depositInBox();
    }, 1500); // match your fly animation duration
    return () => clearTimeout(timer);
    }
}, [clickedIndices, scaryIndices]);

// Increase the fill percentage of the current box and see if we are done
const depositInBox = () => {
    const increment = Math.floor(Math.random() * 21) + 10; // 10–30%
    setMdrData((prev) => {
    const newBoxFillPercentages = [...prev.boxFillPercentages];
    if (newBoxFillPercentages[prev.currentBoxIndex] < 100) {
        newBoxFillPercentages[prev.currentBoxIndex] =
        Math.min(newBoxFillPercentages[prev.currentBoxIndex] + increment, 100);
    }
    // Move on to next box
    let newCurrentBoxIndex = prev.currentBoxIndex;
    if (newBoxFillPercentages[prev.currentBoxIndex] >= 100) {
        newCurrentBoxIndex += 1;
    }
    const newIsComplete = newCurrentBoxIndex >= newBoxFillPercentages.length;
    return {
        ...prev,
        boxFillPercentages: newBoxFillPercentages,
        currentBoxIndex: newCurrentBoxIndex,
        isComplete: newIsComplete,
    };
    });
    // generate new set of numbers if not complete
    setTimeout(() => {
    generateNumbers();
    }, 300);
};

// If all boxes are full, show end screen
if (isComplete) {
    return (
    <div className={styles.congratsContainer}>
        <h1>Congratulations! Kier is reborn!</h1>
        <button
        onClick={() => {
            resetMdrData();
            generateNumbers();
        }}
        >
        Restart
        </button>
    </div>
    );
}

return (
    <div className={styles.mdrPage}>
    <div className={styles.topBar}>
        <span className={styles.handle}>@andrewchilicki</span>
        <div className={styles.lumonLogo}>LUMON</div>
    </div>

    <MdrGrid
        numbers={numbers}
        rowCount={rowCount}
        colCount={colCount}
        clickedIndices={clickedIndices}
        scaryIndices={scaryIndices}
        onNumberClick={handleNumberClick}
        flyAnimationTriggered={flyAnimationTriggered}
    />

    <MdrBoxes />
    </div>
);
};

export default MdrPage;
