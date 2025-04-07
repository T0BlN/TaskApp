// components/MdrBoxes.tsx
import React, { useContext } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import MdrBox from './MdrBox';
import styles from './MdrBoxes.module.css';

const MdrBoxes: React.FC = () => {
  const { mdrData } = useContext(TaskContext)!;
  const { boxFillPercentages } = mdrData;

  return (
    <div className={styles.container}>
      {boxFillPercentages.map((percent, i) => (
        <MdrBox key={i} index={i} fill={percent} />
      ))}
    </div>
  );
};

export default MdrBoxes;
