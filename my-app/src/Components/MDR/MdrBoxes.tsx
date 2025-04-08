import React, { useContext } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import MdrBox from './MdrBox';
import styles from './MdrBoxes.module.css';

interface BoxesProps {
  chosenBoxIndex: number | null;
  boxOpen: boolean;
  boxClosing: boolean;
}

const MdrBoxes: React.FC<BoxesProps> = ({ chosenBoxIndex, boxOpen, boxClosing }) => {
  const { mdrData } = useContext(TaskContext)!;
  const { boxFillPercentages } = mdrData;

  return (
    <div className={styles.boxesRow}>
      {boxFillPercentages.map((fill, i) => (
        <MdrBox
          key={i}
          index={i}
          fill={fill}
          isChosen={chosenBoxIndex === i}
          boxOpen={chosenBoxIndex === i && boxOpen}
          boxClosing={chosenBoxIndex === i && boxClosing}
        />
      ))}
    </div>
  );
};

export default MdrBoxes;
