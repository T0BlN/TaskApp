// MdrPage.tsx
import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import NumberGrid from '../../Components/MDR/NumberGrid';
import BoxesContainer from '../../Components/MDR/BoxesContainer';
import styles from './MdrPage.module.css'; // Optional CSS module for styling

const MdrPage: React.FC = () => {
const { mdrProgress, setMdrProgress, resetMdrProgress } = useContext(TaskContext)!;

// This local state can manage the random numbers displayed, 
// including which ones are “scary” or the user’s current selection
const [numbers, setNumbers] = useState<number[]>([]);
const [scaryIndices, setScaryIndices] = useState<number[]>([]);
const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
const [errorMessage, setErrorMessage] = useState<string>('');

// Generate initial random numbers
useEffect(() => {
    generateNewNumbers();
}, []);

// Function to generate new random numbers
const generateNewNumbers = () => {
    const newNums: number[] = [];
    for (let i = 0; i < 100; i++) {
    newNums.push(Math.floor(Math.random() * 9999)); // random 0-9999
    }
    setNumbers(newNums);

    // Randomly pick a group to be "scary"
    const randomStart = Math.floor(Math.random() * 80);
    const groupSize = 5 + Math.floor(Math.random() * 5); // random group size 5-10
    const newScaryIndices = Array.from({ length: groupSize }, (_, i) => randomStart + i);
    setScaryIndices(newScaryIndices);
    setSelectedIndices([]);
    setErrorMessage('');
};

// Handle selecting a number
const handleNumberClick = (index: number) => {
    // If the index is already selected, unselect it; otherwise select it.
    if (selectedIndices.includes(index)) {
    setSelectedIndices((prev) => prev.filter((i) => i !== index));
    } else {
    setSelectedIndices((prev) => [...prev, index]);
    }
};

// Attempt to place selected numbers in a box
const handlePlaceNumbers = (boxIndex: number) => {
    // check if selected indices == scary indices (i.e. user found the correct group)
    // For simplicity, we’ll say they must match exactly in size and content
    if (selectedIndices.length === scaryIndices.length &&
        selectedIndices.every((val) => scaryIndices.includes(val))) {
    // Correct group
    const increment = Math.floor(Math.random() * 21) + 10; // 10-30
    setMdrProgress((prev) => {
        const newPercentages = [...prev.boxFillPercentages];
        if (newPercentages[boxIndex] < 100) {
        newPercentages[boxIndex] = Math.min(newPercentages[boxIndex] + increment, 100);
        }
        const isComplete = newPercentages.every((val) => val >= 100);

        return {
        boxFillPercentages: newPercentages,
        isComplete,
        };
    });

    // Reset the board
    generateNewNumbers();
    } else {
    // Incorrect
    setErrorMessage('Incorrect!');
    }
};

// If all boxes are full, show the "Congratulations" screen
if (mdrProgress.isComplete) {
    return (
    <div className={styles.congratsContainer}>
        <h1>Congratulations! Kier is reborn!</h1>
        <button
        className={styles.restartButton}
        onClick={() => {
            resetMdrProgress();
            generateNewNumbers();
        }}
        >
        Restart
        </button>
    </div>
    );
}

return (
    <div className={styles.mdrContainer}>
    <h1 className={styles.title}>Macrodata Refinement</h1>
    <div className={styles.mainContent}>
        <NumberGrid
        numbers={numbers}
        scaryIndices={scaryIndices}
        selectedIndices={selectedIndices}
        onNumberClick={handleNumberClick}
        />
        <BoxesContainer
        onPlaceNumbers={handlePlaceNumbers}
        />
    </div>
    {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
);
};

export default MdrPage;
