import React, { useContext } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import './Trash.css';

const Trash: React.FC = () => {
const taskContext = useContext(TaskContext);
if (!taskContext) {
    throw new Error('Trash must be used within a TaskProvider');
}

const { trashedTasks, recoverTask, deleteForever } = taskContext;

return (
    <div className="trash-container">
    <h2>Trashed Tasks</h2>
    <div className="trash-tasks">
        {trashedTasks.length === 0 ? (
        <p>No tasks in trash.</p>
        ) : (
        trashedTasks.map((task) => (
            <div key={task.id} className="trash-item">
            <div>
                <strong>{task.name}</strong> <span>({task.priority})</span>
                <p>{task.description}</p>
            </div>
            <div className="trash-actions">
                <button onClick={() => recoverTask(task.id)}>
                Recover
                </button>
                <button onClick={() => deleteForever(task.id)}>
                Delete Forever
                </button>
            </div>
            </div>
        ))
        )}
    </div>
    </div>
);
};

export default Trash;
