// BoxesContainer.tsx
import React, { useContext } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import Box from './Box';
import styles from './BoxesContainer.module.css';

interface BoxesContainerProps {
onPlaceNumbers: (boxIndex: number) => void;
}

const BoxesContainer: React.FC<BoxesContainerProps> = ({ onPlaceNumbers }) => {
const { mdrProgress } = useContext(TaskContext)!;
const { boxFillPercentages } = mdrProgress;

return (
    <div className={styles.container}>
    {boxFillPercentages.map((fill, index) => (
        <Box
        key={index}
        boxIndex={index}
        fillPercentage={fill}
        onPlaceNumbers={onPlaceNumbers}
        />
    ))}
    </div>
);
};

export default BoxesContainer;
