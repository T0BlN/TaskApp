import React, { useState, FC } from 'react';
import { Task } from '../../Context/TaskContext'; // import your Task type if needed
import './AddTaskModal.css';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
}

const AddTaskModal: FC<AddTaskModalProps> = ({ visible, onClose, onAdd }) => {
  // Local state for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'l' | 'm' | 'h'>('m');

  // If the modal shouldn't be visible, return null (no render)
  if (!visible) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call the onAdd prop with the new task data
    onAdd({
      name,
      description,
      priority,
    });
    // Clear fields
    setName('');
    setDescription('');
    setPriority('m');
    // Close the modal
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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

          <div className="modal-buttons">
            <button type="submit">Add Task</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
