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
        trashedTasks: Task[];
        // Basic add methods (used by the "plus" button or direct additions)
        addTodoTask: (task: Omit<Task, 'id'>) => void;
        addInProgressTask: (task: Omit<Task, 'id'>) => void;
        addCompletedTask: (task: Omit<Task, 'id'>) => void;
        // trashing
        trashTask: (task: Task) => void;
        recoverTask: (id: string) => void;
        deleteForever: (id: string) => void;
        // Removal
        removeTodoTask: (id: string) => void;
        removeInProgressTask: (id: string) => void;
        removeCompletedTask: (id: string) => void;
        // Reorder existing tasks in the same list
        reorderTodoTasks: (startIndex: number, endIndex: number) => void;
        reorderInProgressTasks: (startIndex: number, endIndex: number) => void;
        reorderCompletedTasks: (startIndex: number, endIndex: number) => void;
        // Insert tasks at a specific index (for cross-column moves)
        insertTodoTask: (task: Partial<Task>, index: number) => void;
        insertInProgressTask: (task: Partial<Task>, index: number) => void;
        insertCompletedTask: (task: Partial<Task>, index: number) => void;

        //update
        updateTask: (task: Task) => void;
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
        const [trashedTasks, setTrashedTasks] = useState<Task[]>(() => {
            const saved = localStorage.getItem('trashedTasks');
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
        useEffect(() => {
            localStorage.setItem('trashedTasks', JSON.stringify(trashedTasks));
        }, [trashedTasks]);

        // Basic "add" appends to end of list (used by "plus" button)
        const addTodoTask = useCallback((task: Omit<Task, 'id'>) => {
            setTodoTasks((prev) => [...prev, { ...task, id: uuidv4() }]);
        }, []);
        const addInProgressTask = useCallback((task: Omit<Task, 'id'>) => {
            setInProgressTasks((prev) => [...prev, { ...task, id: uuidv4() }]);
        }, []);
        const addCompletedTask = useCallback((task: Omit<Task, 'id'>) => {
            setCompletedTasks((prev) => [...prev, { ...task, id: uuidv4() }]);
        }, []);

        // Removal
        const removeTodoTask = useCallback((id: string) => {
            setTodoTasks((prev) => prev.filter((task) => task.id !== id));
        }, []);
        const removeInProgressTask = useCallback((id: string) => {
            setInProgressTasks((prev) => prev.filter((task) => task.id !== id));
        }, []);
        const removeCompletedTask = useCallback((id: string) => {
            setCompletedTasks((prev) => prev.filter((task) => task.id !== id));
        }, []);

        const trashTask = useCallback((task: Task) => {
            // 1) Remove from whichever list it might be in
            setTodoTasks((prev) => prev.filter((t) => t.id !== task.id));
            setInProgressTasks((prev) => prev.filter((t) => t.id !== task.id));
            setCompletedTasks((prev) => prev.filter((t) => t.id !== task.id));
        
            // 2) Add to trashedTasks
            setTrashedTasks((prev) => [...prev, task]);
          }, []);
        const recoverTask = useCallback((id: string) => {
            let recoveredTask: Task | undefined;
        
            // Remove from trash first
            setTrashedTasks((prevTrash) => {
            const found = prevTrash.find((t) => t.id === id);
            if (!found) return prevTrash;
            recoveredTask = found;
            // Remove from trash
            return prevTrash.filter((t) => t.id !== id);
            });
        
            // Then add to todoTasks
            if (recoveredTask) {
            setTodoTasks((prev) => [...prev, recoveredTask!]);
            }
        }, []);
        const deleteForever = useCallback((id: string) => {
            setTrashedTasks((prevTrash) => prevTrash.filter((t) => t.id !== id));
        }, []);

        // Reorder tasks within the same list (used by handleDragEnd if same droppable)
        const reorder = (list: Task[], start: number, end: number) => {
            const result = [...list];
            const [removed] = result.splice(start, 1);
            result.splice(end, 0, removed);
            return result;
        };
        function reorderTodoTasks(startIndex: number, endIndex: number) {
            setTodoTasks((prev) => reorder(prev, startIndex, endIndex));
        }
        function reorderInProgressTasks(startIndex: number, endIndex: number) {
            setInProgressTasks((prev) => reorder(prev, startIndex, endIndex));
        }
        function reorderCompletedTasks(startIndex: number, endIndex: number) {
            setCompletedTasks((prev) => reorder(prev, startIndex, endIndex));
        }

        // Insert at a specific index (for cross-column moves),
        // reusing the same `id` if provided or generating a new one if none exists
        function insertTodoTask(task: Partial<Task>, index: number) {
            setTodoTasks((prev) => {
                const newId = task.id || uuidv4();
                const newTask: Task = {
                    id: newId,
                    name: task.name ?? '',
                    description: task.description ?? '',
                    priority: task.priority ?? 'm',
                };
                const updated = [...prev];
                updated.splice(index, 0, newTask);
                return updated;
            });
        }
        function insertInProgressTask(task: Partial<Task>, index: number) {
            setInProgressTasks((prev) => {
                const newId = task.id || uuidv4();
                const newTask: Task = {
                    id: newId,
                    name: task.name ?? '',
                    description: task.description ?? '',
                    priority: task.priority ?? 'm',
                };
                const updated = [...prev];
                updated.splice(index, 0, newTask);
                return updated;
            });
        }
        function insertCompletedTask(task: Partial<Task>, index: number) {
            setCompletedTasks((prev) => {
                const newId = task.id || uuidv4();
                const newTask: Task = {
                    id: newId,
                    name: task.name ?? '',
                    description: task.description ?? '',
                    priority: task.priority ?? 'm',
                };
                const updated = [...prev];
                updated.splice(index, 0, newTask);
                return updated;
            });
        }

        function updateTask(updated: Task) {
            // update in To Do
            setTodoTasks((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
            );
            // update in In Progress
            setInProgressTasks((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
            );
            // update in Completed
            setCompletedTasks((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
            );
        }

        const contextValue: TaskContextValue = {
            todoTasks,
            inProgressTasks,
            completedTasks,
            trashedTasks,
            addTodoTask,
            addInProgressTask,
            addCompletedTask,
            trashTask,
            recoverTask,
            deleteForever,
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
        };

        return (
            <TaskContext.Provider value={contextValue}>
                {children}
            </TaskContext.Provider>
        );
    };
