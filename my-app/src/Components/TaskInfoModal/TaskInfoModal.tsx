import { useState, FC, useEffect } from 'react';
import { Task } from '../../Context/TaskContext';
import './TaskInfoModal.css';

interface TaskInfoModalProps {
    visible: boolean;
    task: Task | null;
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
}

const TaskInfoModal: FC<TaskInfoModalProps> = ({
    visible,
    task,
    onClose,
    onSave,
}) => {
// Local state for edits
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [priority, setPriority] = useState<'l' | 'm' | 'h'>('m');

// Whenever the modal opens or task changes, load data into local state
useEffect(() => {
    if (task) {
    setName(task.name);
    setDescription(task.description);
    setPriority(task.priority);
    }
}, [task]);

if (!visible || !task) {
    return null; // Hide modal if not visible or no task
}

const handleSave = () => {
    // Pass the updated fields up
    onSave({
    ...task,
    name,
    description,
    priority,
    });
};

return (
    <div className="info-modal-overlay">
        <div className="info-modal-content">
            <h2>Task Info</h2>

            <div className="form-group">
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Priority:</label>
                <div className="priority-circles">
                <div
                    onClick={() => setPriority('l')}
                    className={`circle low ${priority === 'l' ? 'selected' : ''}`}
                ></div>
                <div
                    onClick={() => setPriority('m')}
                    className={`circle medium ${priority === 'm' ? 'selected' : ''}`}
                ></div>
                <div
                    onClick={() => setPriority('h')}
                    className={`circle high ${priority === 'h' ? 'selected' : ''}`}
                ></div>
                </div>
            </div>

            <div className="button-row">
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
    );
};

export default TaskInfoModal;
