import React, { useContext, useState } from 'react';
import { TaskContext, Task } from '../../Context/TaskContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';

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

  // Called when user submits modal form for "To Do"
  const handleAddTodoTask = (taskData: { name: string; description: string; priority: 'l' | 'm' | 'h' }) => {
    addTodoTask(taskData);
  };

  // Open the info modal
  const handleShowInfo = (task: Task) => {
    setSelectedTask(task);
    setInfoModalVisible(true);
  };

  // When user saves changes in TaskInfoModal
  const handleSaveInfo = (updated: Task) => {
    updateTask(updated);
    setInfoModalVisible(false);
    setSelectedTask(null);
  };

  // Close info modal
  const handleCloseInfoModal = () => {
    setInfoModalVisible(false);
    setSelectedTask(null);
  };

  // trash button navigation
  const handleGoToTrash = () => {
    navigate('/trash');
  };

  // Handle final drag event
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return; // dropped in same spot
    }

    // Reorder within the SAME column
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

    // Different column => remove & insert
    let draggedTask: Task | undefined;
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

    // Insert into new list
    if (destination.droppableId === 'todo') {
      insertTodoTask({
        id: draggedTask.id,
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority
      }, destination.index);
    } else if (destination.droppableId === 'inProgress') {
      insertInProgressTask({
        id: draggedTask.id,
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority
      }, destination.index);
    } else if (destination.droppableId === 'completed') {
      insertCompletedTask({
        id: draggedTask.id,
        name: draggedTask.name,
        description: draggedTask.description,
        priority: draggedTask.priority
      }, destination.index);
    }
  };

  return (
    <>
      <button className="fixed-trash-icon" onClick={handleGoToTrash}>
        <DeleteIcon fontSize="inherit" />
      </button>
      <h1 className="page-title">Task Board</h1>

      <div className="home-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* TO DO COLUMN */}
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
                        >
                          <div className={`priority-dot ${ task.priority === 'l' ? 'low' : 
                          task.priority === 'm' ? 'medium' : 'high'}`}></div>
                          <div className="task-content">
                            <div className="task-name">{task.name}</div>
                          </div>
                          <div className="task-buttons">
                            <button className="info-button" onClick={() => handleShowInfo(task)}>
                              <InfoIcon style={{fontSize: '1.2rem' }}/>
                            </button>
                            <button className="task-trash-button" onClick={() => trashTask(task)}>
                              <DeleteIcon style={{fontSize: '1.2rem' }}/>
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

          {/* IN PROGRESS COLUMN */}
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
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div className={`priority-dot ${ task.priority === 'l' ? 'low' : 
                          task.priority === 'm' ? 'medium' : 'high'}`}></div>
                          <div className="task-content">
                            <div className="task-name">{task.name}</div>
                          </div>
                          <div className="task-buttons">
                            <button className="info-button" onClick={() => handleShowInfo(task)}>
                              <InfoIcon style={{fontSize: '1.2rem' }}/>
                            </button>
                            <button className="task-trash-button" onClick={() => trashTask(task)}>
                              <DeleteIcon style={{fontSize: '1.2rem' }}/>
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

          {/* COMPLETED COLUMN */}
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
                        >
                          <div className={`priority-dot ${ task.priority === 'l' ? 'low' : 
                          task.priority === 'm' ? 'medium' : 'high'}`}></div>
                          <div className="task-content">
                            <div className="task-name">{task.name}</div>
                          </div>
                          <div className="task-buttons">
                            <button className="info-button" onClick={() => handleShowInfo(task)}>
                              <InfoIcon style={{fontSize: '1.2rem' }}/>
                            </button>
                            <button className="task-trash-button" onClick={() => trashTask(task)}>
                              <DeleteIcon style={{fontSize: '1.2rem' }}/>
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
