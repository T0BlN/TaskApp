import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';

import { TaskContext, Task } from '../../Context/TaskContext';

import AddTaskModal from '../../Components/AddTaskModal/AddTaskModal';
import TaskInfoModal from '../../Components/TaskInfoModal/TaskInfoModal';

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
    trashTask,
    removeTodoTask,
    removeInProgressTask,
    removeCompletedTask,
    reorderTodoTasks,
    reorderInProgressTasks,
    reorderCompletedTasks,
    insertTodoTask,
    insertInProgressTask,
    insertCompletedTask,
    updateTask,
  } = taskContext;

  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const navigate = useNavigate();

  const handleAddTodoTask = (taskData: { name: string; description: string; priority: 'l' | 'm' | 'h' }) => {
    addTodoTask(taskData);
  };

  const handleShowInfo = (task: Task) => {
    setSelectedTask(task);
    setInfoModalVisible(true);
  };
  const handleSaveInfo = (updated: Task) => {
    updateTask(updated);
    setInfoModalVisible(false);
    setSelectedTask(null);
  };
  const handleCloseInfoModal = () => {
    setInfoModalVisible(false);
    setSelectedTask(null);
  };

  const handleGoToTrash = () => {
    navigate('/trash');
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'todo') reorderTodoTasks(source.index, destination.index);
      if (source.droppableId === 'inProgress') reorderInProgressTasks(source.index, destination.index);
      if (source.droppableId === 'completed') reorderCompletedTasks(source.index, destination.index);
      return;
    }

    let draggedTask: Task | undefined;
    if (source.droppableId === 'todo') {
      draggedTask = todoTasks.find((t) => t.id === draggableId);
      if (draggedTask) removeTodoTask(draggedTask.id);
    } else if (source.droppableId === 'inProgress') {
      draggedTask = inProgressTasks.find((t) => t.id === draggableId);
      if (draggedTask) removeInProgressTask(draggedTask.id);
    } else if (source.droppableId === 'completed') {
      draggedTask = completedTasks.find((t) => t.id === draggableId);
      if (draggedTask) removeCompletedTask(draggedTask.id);
    }
    if (!draggedTask) return;

    if (destination.droppableId === 'todo') {
      insertTodoTask({ ...draggedTask }, destination.index);
    } else if (destination.droppableId === 'inProgress') {
      insertInProgressTask({ ...draggedTask }, destination.index);
    } else if (destination.droppableId === 'completed') {
      insertCompletedTask({ ...draggedTask }, destination.index);
    }
  };

  const [mysteriousNum] = useState(() => Math.floor(Math.random() * 10));
  const handleClickMysterious = () => {
    navigate('/mdr');
  };

  return (
    <>
      <div
        className="mysterious-number"
        title="This looks important and mysterious"
        onClick={handleClickMysterious}
      >
        {mysteriousNum}
      </div>

      <button className="fixed-trash-icon" onClick={handleGoToTrash}>
        <DeleteIcon fontSize="inherit" />
      </button>
      <h1 className="page-title">Task Board</h1>

      <div className="home-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* TO DO Column */}
          <Droppable droppableId="todo">
            {(provided, snapshot) => (
              <div className="column">
                <div className="column-header todo-header">
                  <h2>TO DO</h2>
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
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                          style={{ ...provided.draggableProps.style }}
                          onDoubleClick={() => handleShowInfo(task)}
                        >
                          <div
                            className={`priority-dot ${
                              task.priority === 'l'
                                ? 'low'
                                : task.priority === 'm'
                                ? 'medium'
                                : 'high'
                            }`}
                          ></div>
                          <div className="task-content">
                            <div className="task-name">{task.name}</div>
                          </div>
                          <div className="task-buttons">
                            <button
                              className="info-button"
                              onClick={() => handleShowInfo(task)}
                            >
                              <InfoIcon style={{ fontSize: '1.2rem' }} />
                            </button>
                            <button
                              className="task-trash-button"
                              onClick={() => trashTask(task)}
                            >
                              <DeleteIcon style={{ fontSize: '1.2rem' }} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* IN PROGRESS Column */}
          <Droppable droppableId="inProgress">
            {(provided, snapshot) => (
              <div className="column">
                <div className="column-header">
                  <h2>IN PROGRESS</h2>
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
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                          onDoubleClick={() => handleShowInfo(task)}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div
                            className={`priority-dot ${
                              task.priority === 'l'
                                ? 'low'
                                : task.priority === 'm'
                                ? 'medium'
                                : 'high'
                            }`}
                          ></div>
                          <div className="task-content">
                            <div className="task-name">{task.name}</div>
                          </div>
                          <div className="task-buttons">
                            <button
                              className="info-button"
                              onClick={() => handleShowInfo(task)}
                            >
                              <InfoIcon style={{ fontSize: '1.2rem' }} />
                            </button>
                            <button
                              className="task-trash-button"
                              onClick={() => trashTask(task)}
                            >
                              <DeleteIcon style={{ fontSize: '1.2rem' }} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* COMPLETED Column */}
          <Droppable droppableId="completed">
            {(provided, snapshot) => (
              <div className="column">
                <div className="column-header">
                  <h2>COMPLETE</h2>
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
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                          style={{ ...provided.draggableProps.style }}
                          onDoubleClick={() => handleShowInfo(task)}
                        >
                          <div
                            className={`priority-dot ${
                              task.priority === 'l'
                                ? 'low'
                                : task.priority === 'm'
                                ? 'medium'
                                : 'high'
                            }`}
                          ></div>
                          <div className="task-content">
                            <div className="task-name">{task.name}</div>
                          </div>
                          <div className="task-buttons">
                            <button
                              className="info-button"
                              onClick={() => handleShowInfo(task)}
                            >
                              <InfoIcon style={{ fontSize: '1.2rem' }} />
                            </button>
                            <button
                              className="task-trash-button"
                              onClick={() => trashTask(task)}
                            >
                              <DeleteIcon style={{ fontSize: '1.2rem' }} />
                            </button>
                          </div>
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

        {/* Modal for adding tasks */}
        <AddTaskModal
          visible={showModal}
          onClose={handleCloseModal}
          onAdd={handleAddTodoTask}
        />
      </div>

      {/* Info Modal */}
      <TaskInfoModal
        visible={infoModalVisible}
        task={selectedTask}
        onClose={handleCloseInfoModal}
        onSave={handleSaveInfo}
      />
    </>
  );
};

export default Home;
