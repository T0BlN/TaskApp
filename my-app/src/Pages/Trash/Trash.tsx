import React, { useContext, useState } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import { useNavigate } from 'react-router-dom';
import './Trash.css';

const Trash: React.FC = () => {
const taskContext = useContext(TaskContext);
if (!taskContext) {
    throw new Error('Trash must be used within a TaskProvider');
}

const { trashedTasks, recoverTask, deleteForever } = taskContext;
const navigate = useNavigate();

// For multi-selection
const [selectedIds, setSelectedIds] = useState<string[]>([]);

const handleGoHome = () => {
    navigate('/');
};

// Toggle selection on click
const handleTaskClick = (id: string) => {
    setSelectedIds((prev) =>
    prev.includes(id)
        ? prev.filter((taskId) => taskId !== id)
        : [...prev, id]
    );
};

// Bulk recover
const handleBulkRecover = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => recoverTask(id));
    setSelectedIds([]);
};

// Bulk delete
const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => deleteForever(id));
    setSelectedIds([]);
};

return (
    <>
    <button className="fixed-home-icon" onClick={handleGoHome}>
        Home
    </button>
    <h2 className="trash-title">Trashed Tasks</h2>
    <div className="trash-container">
        {trashedTasks.length === 0 ? (
          <p>No tasks in trash.</p>
        ) : (
          trashedTasks.map((task) => {
            const isSelected = selectedIds.includes(task.id);
            return (
              <div
                key={task.id}
                className={`trash-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="trash-item-content">
                  <strong>{task.name}</strong> <span>({task.priority})</span>
                </div>
                {isSelected && <div className="check-icon">✅</div>}
              </div>
            );
          })
        )}
    </div>
    <div className="trash-bulk-actions">
        <button onClick={handleBulkRecover}>Recover Selected</button>
        <button onClick={handleBulkDelete}>Delete Forever</button>
    </div>
    </>
);
};

export default Trash;
