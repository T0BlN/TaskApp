import React, { useContext, useState } from 'react';
import { TaskContext } from '../../Context/TaskContext';
import {
DragDropContext,
Droppable,
Draggable,
DropResult
} from '@hello-pangea/dnd';

import AddTaskModal from '../../Components/AddTaskModal/AddTaskModal';
import './Home.css';

const Home: React.FC = () => {
const taskContext = useContext(TaskContext);
if (!taskContext) {
    throw new Error('Home must be used within a TaskProvider');
}

const {
    todoTasks,
    inProgressTasks,
    completedTasks,
    addTodoTask,
    // remove methods
    removeTodoTask,
    removeInProgressTask,
    removeCompletedTask,
    // reorder methods for same-list
    reorderTodoTasks,
    reorderInProgressTasks,
    reorderCompletedTasks,
    // insert methods for cross-column
    insertTodoTask,
    insertInProgressTask,
    insertCompletedTask
} = taskContext;

const [showModal, setShowModal] = useState(false);
const handleOpenModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);

// Called when user submits modal form for "To Do"
const handleAddTodoTask = (taskData: { name: string; description: string; priority: 'l' | 'm' | 'h' }) => {
    addTodoTask(taskData);
};

const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
    return; // dropped in same spot
    }

    // 1) If user reorders within the SAME column
    if (source.droppableId === destination.droppableId) {
    if (source.droppableId === 'todo') {
        reorderTodoTasks(source.index, destination.index);
    } else if (source.droppableId === 'inProgress') {
        reorderInProgressTasks(source.index, destination.index);
    } else if (source.droppableId === 'completed') {
        reorderCompletedTasks(source.index, destination.index);
    }
    return;
    }

    // 2) Different column => remove from old and insert at new location
    let draggedTask = null;
    if (source.droppableId === 'todo') {
    draggedTask = todoTasks.find((t) => t.id === draggableId);
    } else if (source.droppableId === 'inProgress') {
    draggedTask = inProgressTasks.find((t) => t.id === draggableId);
    } else if (source.droppableId === 'completed') {
    draggedTask = completedTasks.find((t) => t.id === draggableId);
    }
    if (!draggedTask) return;

    // Remove from old list
    if (source.droppableId === 'todo') {
    removeTodoTask(draggedTask.id);
    } else if (source.droppableId === 'inProgress') {
    removeInProgressTask(draggedTask.id);
    } else if (source.droppableId === 'completed') {
    removeCompletedTask(draggedTask.id);
    }

    // Insert into new list at destination.index
    if (destination.droppableId === 'todo') {
    insertTodoTask(
        {
        id: draggedTask.id, // preserve same ID if you want
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority
        },
        destination.index
    );
    } else if (destination.droppableId === 'inProgress') {
    insertInProgressTask(
        {
        id: draggedTask.id,
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority
        },
        destination.index
    );
    } else if (destination.droppableId === 'completed') {
    insertCompletedTask(
        {
        id: draggedTask.id,
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority
        },
        destination.index
    );
    }
};

return (
    <div className="home-container">
    <DragDropContext onDragEnd={handleDragEnd}>
        
        {/* TODO COLUMN */}
        <Droppable droppableId="todo">
        {(provided, snapshot) => (
            <div className="column">
                <div className="column-header">
                    <h2>To Do</h2>
                    <button onClick={handleOpenModal} className="add-task-button">+</button>
                </div>
                <div 
                className={`tasks-container ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
                >
                    {todoTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                        <div
                            className={`task-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                        >
                            <div className="task-name">{task.name}</div>
                            <div className="task-description">{task.description}</div>
                            <div className="task-info">Priority: {task.priority}</div>
                        </div>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            </div>
        )}
        </Droppable>

        {/* IN PROGRESS COLUMN */}
        <Droppable droppableId="inProgress">
        {(provided, snapshot) => (
            <div className="column">
            <div className="column-header">
                <h2>In Progress</h2>
            </div>
            <div
                className={`tasks-container ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {inProgressTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                    <div
                        className={`task-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...provided.draggableProps.style }}
                    >
                        <div className="task-name">{task.name}</div>
                        <div className="task-description">{task.description}</div>
                        <div className="task-info">Priority: {task.priority}</div>
                    </div>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </div>
            </div>
        )}
        </Droppable>

        {/* COMPLETED COLUMN */}
        <Droppable droppableId="completed">
        {(provided, snapshot) => (
            <div className="column">
            <div className="column-header">
                <h2>Completed</h2>
            </div>
            <div
                className={`tasks-container ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {completedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                    <div
                        className={`task-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...provided.draggableProps.style }}
                    >
                        <div className="task-name">{task.name}</div>
                        <div className="task-description">{task.description}</div>
                        <div className="task-info">Priority: {task.priority}</div>
                    </div>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </div>
            </div>
        )}
        </Droppable>
    </DragDropContext>

    {/* Modal */}
    <AddTaskModal
        visible={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddTodoTask}
    />
    </div>
);
};

export default Home;
