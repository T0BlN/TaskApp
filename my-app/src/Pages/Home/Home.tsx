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
    addInProgressTask,
    addCompletedTask,
    removeTodoTask,
    removeInProgressTask,
    removeCompletedTask,
  } = taskContext;

  // State to control showing/hiding the "Add Task" modal
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  /**
   * Called when the user submits the modal form
   */
  const handleAddTodoTask = (taskData: { name: string; description: string; priority: 'l' | 'm' | 'h' }) => {
    // Add to "To Do" list
    addTodoTask(taskData);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

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
    if (source.droppableId === 'todo') removeTodoTask(draggedTask.id);
    if (source.droppableId === 'inProgress') removeInProgressTask(draggedTask.id);
    if (source.droppableId === 'completed') removeCompletedTask(draggedTask.id);

    // Add to new list
    if (destination.droppableId === 'todo') {
      addTodoTask({
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority,
      });
    } else if (destination.droppableId === 'inProgress') {
      addInProgressTask({
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority,
      });
    } else if (destination.droppableId === 'completed') {
      addCompletedTask({
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority,
      });
    }
  };

  return (
    <div className="home-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* ============================ */}
        {/* 1) TODO COLUMN             */}
        {/* ============================ */}
        <Droppable droppableId="todo">
          {(provided, snapshot) => (
            <div
              className={`column ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="column-header">
                <h2>To Do</h2>
                {/* PLUS BUTTON: Clicking opens the modal */}
                <button onClick={handleOpenModal} className="add-task-button">
                  +
                </button>
              </div>

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
                      <div className="task-info">
                        Priority: {task.priority}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* 2) IN PROGRESS COLUMN */}
        <Droppable droppableId="inProgress">
          {(provided, snapshot) => (
            <div
              className={`column ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h2>In Progress</h2>
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
                      <div className="task-info">
                        Priority: {task.priority}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* 3) COMPLETED COLUMN */}
        <Droppable droppableId="completed">
          {(provided, snapshot) => (
            <div
              className={`column ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h2>Completed</h2>
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
                      <div className="task-info">
                        Priority: {task.priority}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* 4) The Modal (conditionally rendered) */}
      <AddTaskModal
        visible={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddTodoTask}
      />
    </div>
  );
};

export default Home;
