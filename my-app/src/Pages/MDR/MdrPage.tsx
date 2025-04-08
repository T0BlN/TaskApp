import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../../Context/TaskContext';
import MdrGrid from '../../Components/MDR/MdrGrid';
import MdrBoxes from '../../Components/MDR/MdrBoxes';
import styles from './MdrPage.module.css';

const MdrPage: React.FC = () => {
    const { mdrData, setMdrData, resetMdrData } = useContext(TaskContext)!;
    const { boxFillPercentages, isComplete } = mdrData;

    const rowCount = 25;
    const colCount = 35;
    const totalCount = rowCount * colCount;

    const [numbers, setNumbers] = useState<number[]>([]);
    const [scaryIndices, setScaryIndices] = useState<number[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

    const [chosenBoxIndex, setChosenBoxIndex] = useState<number | null>(null);
    const [boxOpen, setBoxOpen] = useState(false);
    const [boxClosing, setBoxClosing] = useState(false);

    const [numbersDisappearing, setNumbersDisappearing] = useState(false);

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
      };

    useEffect(() => {
        generateNumbers();
    }, []);

    function generateNumbers() {
        const newNums: number[] = [];
        for (let i = 0; i < totalCount; i++) {
        newNums.push(Math.floor(Math.random() * 10));
        }
        setNumbers(newNums);

        const cluster = createRandomScaryCluster(rowCount, colCount);
        setScaryIndices(cluster);

        setSelectedIndices(new Set());
        setNumbersDisappearing(false);
        setBoxOpen(false);
        setBoxClosing(false);
        setChosenBoxIndex(null);
    }

    const allScarySelected =
        scaryIndices.length > 0 &&
        scaryIndices.every((idx) => selectedIndices.has(idx));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === 'b' || e.key === 'B') && allScarySelected && !boxOpen && !isComplete) {
            openRandomBox();
        } else if (e.key === 'Enter' && boxOpen && !boxClosing && !numbersDisappearing) {
            depositScaryNumbers();
        }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [allScarySelected, boxOpen, boxClosing, numbersDisappearing, isComplete]);

    function openRandomBox() {
        const notFull = boxFillPercentages
        .map((val, idx) => ({ val, idx }))
        .filter((b) => b.val < 100);
        if (!notFull.length) return;

        const r = Math.floor(Math.random() * notFull.length);
        setChosenBoxIndex(notFull[r].idx);
        setBoxOpen(true);
        setBoxClosing(false);
    }

    function depositScaryNumbers() {
        setNumbersDisappearing(true);

        setTimeout(() => {
        setBoxClosing(true);

        setTimeout(() => {
            fillBoxAndRefresh();
        }, 1500);
        }, 1500);
    }

    function fillBoxAndRefresh() {
        if (chosenBoxIndex !== null) {
        const inc = Math.floor(Math.random() * 21) + 10;
        setMdrData((prev) => {
            const newFills = [...prev.boxFillPercentages];
            if (newFills[chosenBoxIndex] < 100) {
            newFills[chosenBoxIndex] = Math.min(newFills[chosenBoxIndex] + inc, 100);
            }
            const done = newFills.every((x) => x >= 100);
            return { ...prev, boxFillPercentages: newFills, isComplete: done };
        });
        }
        setBoxOpen(false);
        setBoxClosing(false);
        setChosenBoxIndex(null);
        setNumbersDisappearing(false);

        if (!isComplete) {
        generateNumbers();
        }
    }

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
        <div className={styles.pageContainer}>
        <div className={styles.topBar}>
            <button className={styles.backArrow} onClick={handleGoHome}>
            &larr;
            </button>
            <div className={styles.handle}>Cold Harbor</div>
            <div className={styles.lumonLogo}>LUMON</div>
        </div>

        <div className={styles.gridSection}>
            <MdrGrid
            numbers={numbers}
            rowCount={rowCount}
            colCount={colCount}
            scaryIndices={scaryIndices}
            selectedIndices={selectedIndices}
            setSelectedIndices={setSelectedIndices}
            numbersDisappearing={numbersDisappearing}
            />
        </div>

        <div className={styles.boxesSection}>
            <MdrBoxes
            chosenBoxIndex={chosenBoxIndex}
            boxOpen={boxOpen}
            boxClosing={boxClosing}
            />
        </div>
        </div>
    );
};

export default MdrPage;

function createRandomScaryCluster(rowCount: number, colCount: number): number[] {
    const maxWidth = 3;
    const maxHeight = 3;
    const width = Math.floor(Math.random() * maxWidth) + 1;
    const height = Math.floor(Math.random() * maxHeight) + 1;
    let totalCells = width * height;

    if (totalCells < 5) {
        return createRandomScaryCluster(rowCount, colCount);
    }

    const keepMap: boolean[] = Array(totalCells).fill(true);
    while (totalCells > 9) {
        const idx = Math.floor(Math.random() * keepMap.length);
        if (keepMap[idx]) {
        keepMap[idx] = false;
        totalCells--;
        }
    }

    const maxRowStart = rowCount - height;
    const maxColStart = colCount - width;
    if (maxRowStart < 0 || maxColStart < 0) return [];

    const rowStart = Math.floor(Math.random() * (maxRowStart + 1));
    const colStart = Math.floor(Math.random() * (maxColStart + 1));

    const scary: number[] = [];
    let subIndex = 0;
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
        if (keepMap[subIndex]) {
            scary.push((rowStart + r) * colCount + (colStart + c));
        }
        subIndex++;
        }
    }
    return scary;
}
