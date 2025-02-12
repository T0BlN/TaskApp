import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
  } from 'react';
  import { v4 as uuidv4 } from 'uuid';
  
  export interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'l' | 'm' | 'h';
  }

  interface TaskContextValue {
    todoTasks: Task[];
    inProgressTasks: Task[];
    completedTasks: Task[];
    addTodoTask: (task: Omit<Task, 'id'>) => void;
    addInProgressTask: (task: Omit<Task, 'id'>) => void;
    addCompletedTask: (task: Omit<Task, 'id'>) => void;
    removeTodoTask: (id: string) => void;
    removeInProgressTask: (id: string) => void;
    removeCompletedTask: (id: string) => void;
  }
  
  export const TaskContext = createContext<TaskContextValue | undefined>(
    undefined
  );
  
  interface TaskProviderProps {
    children: ReactNode;
  }
  
  export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
    const [todoTasks, setTodoTasks] = useState<Task[]>(() => {
      const saved = localStorage.getItem('todoTasks');
      return saved ? JSON.parse(saved) : [];
    });
    const [inProgressTasks, setInProgressTasks] = useState<Task[]>(() => {
      const saved = localStorage.getItem('inProgressTasks');
      return saved ? JSON.parse(saved) : [];
    });
    const [completedTasks, setCompletedTasks] = useState<Task[]>(() => {
      const saved = localStorage.getItem('completedTasks');
      return saved ? JSON.parse(saved) : [];
    });
  
    useEffect(() => {
      localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
    }, [todoTasks]); 
    useEffect(() => {
      localStorage.setItem('inProgressTasks', JSON.stringify(inProgressTasks));
    }, [inProgressTasks]);
    useEffect(() => {
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }, [completedTasks]);
  
    const addTodoTask = useCallback((task: Omit<Task, 'id'>) => {
      setTodoTasks((prev) => [...prev, { ...task, id: uuidv4() }]);
    }, []);
    const addInProgressTask = useCallback((task: Omit<Task, 'id'>) => {
      setInProgressTasks((prev) => [...prev, { ...task, id: uuidv4() }]);
    }, []); 
    const addCompletedTask = useCallback((task: Omit<Task, 'id'>) => {
      setCompletedTasks((prev) => [...prev, { ...task, id: uuidv4() }]);
    }, []);
  
    const removeTodoTask = useCallback((id: string) => {
      setTodoTasks((prev) => prev.filter((task) => task.id !== id));
    }, []);  
    const removeInProgressTask = useCallback((id: string) => {
      setInProgressTasks((prev) => prev.filter((task) => task.id !== id));
    }, []); 
    const removeCompletedTask = useCallback((id: string) => {
      setCompletedTasks((prev) => prev.filter((task) => task.id !== id));
    }, []);
  
    const contextValue: TaskContextValue = {
      todoTasks,
      inProgressTasks,
      completedTasks,
      addTodoTask,
      addInProgressTask,
      addCompletedTask,
      removeTodoTask,
      removeInProgressTask,
      removeCompletedTask,
    };
  
    return (
      <TaskContext.Provider value={contextValue}>
        {children}
      </TaskContext.Provider>
    );
  };
  