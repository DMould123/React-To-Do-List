import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('none');
  const [showArchived, setShowArchived] = useState(false);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);

  // Load tasks and archived tasks from LocalStorage on app startup
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const storedArchivedTasks = localStorage.getItem('archivedTasks');
    if (storedArchivedTasks) {
      setArchivedTasks(JSON.parse(storedArchivedTasks));
    }
  }, []);

  // Save tasks and archived tasks to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
  }, [archivedTasks]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const newTaskObject = {
      id: crypto.randomUUID(),
      title: newTask,
      completed: false,
      dueDate: null,
      priority: 'medium', // default priority is medium
    };

    setTasks((ongoingTasks) => {
      return [...ongoingTasks, newTaskObject];
    });

    setActionHistory((history) => {
      const newHistory = history.slice(0, currentActionIndex + 1);
      return [...newHistory, { type: 'add', taskId: newTaskObject.id }];
    });

    setCurrentActionIndex((index) => index + 1);
    setNewTask(''); // clear the input field after adding the task
  }

  function handleToggleComplete(taskId) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      });

      setActionHistory((history) => {
        const newHistory = history.slice(0, currentActionIndex + 1);
        return [...newHistory, { type: 'toggleComplete', taskId }];
      });

      setCurrentActionIndex((index) => index + 1);
      return updatedTasks;
    });
  }

  function handleDeleteTask(taskId) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.filter((task) => task.id !== taskId);

      setActionHistory((history) => {
        const newHistory = history.slice(0, currentActionIndex + 1);
        return [...newHistory, { type: 'delete', task }];
      });

      setCurrentActionIndex((index) => index + 1);
      return updatedTasks;
    });
  }

  function handleEditTask(taskId, newTitle) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, title: newTitle };
        } else {
          return task;
        }
      });

      setActionHistory((history) => {
        const newHistory = history.slice(0, currentActionIndex + 1);
        return [...newHistory, { type: 'edit', taskId, newTitle }];
      });

      setCurrentActionIndex((index) => index + 1);
      return updatedTasks;
    });
  }

  function handleDueDateChange(taskId, newDueDate) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, dueDate: newDueDate };
        } else {
          return task;
        }
      });

      setActionHistory((history) => {
        const newHistory = history.slice(0, currentActionIndex + 1);
        return [...newHistory, { type: 'dueDateChange', taskId, newDueDate }];
      });

      setCurrentActionIndex((index) => index + 1);
      return updatedTasks;
    });
  }

  function handlePriorityChange(taskId, newPriority) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, priority: newPriority };
        } else {
          return task;
        }
      });

      setActionHistory((history) => {
        const newHistory = history.slice(0, currentActionIndex + 1);
        return [...newHistory, { type: 'priorityChange', taskId, newPriority }];
      });

      setCurrentActionIndex((index) => index + 1);
      return updatedTasks;
    });
  }

  function handleArchiveCompletedTasks() {
    const completedTasks = tasks.filter((task) => task.completed);
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed));
    setArchivedTasks((currentArchivedTasks) => [...currentArchivedTasks, ...completedTasks]);

    setActionHistory((history) => {
      const newHistory = history.slice(0, currentActionIndex + 1);
      return [...newHistory, { type: 'archiveCompleted' }];
    });

    setCurrentActionIndex((index) => index + 1);
  }

  function handleUndo() {
    if (currentActionIndex >= 0) {
      const actionToUndo = actionHistory[currentActionIndex];
      setCurrentActionIndex((index) => index - 1);

      switch (actionToUndo.type) {
        case 'add':
          setTasks((currentTasks) => currentTasks.filter((task) => task.id !== actionToUndo.taskId));
          break;
        case 'toggleComplete':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToUndo.taskId) {
                return { ...task, completed: !task.completed };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'delete':
          setTasks((currentTasks) => [...currentTasks, actionToUndo.task]);
          break;
        case 'edit':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToUndo.taskId) {
                return { ...task, title: actionToUndo.newTitle };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'dueDateChange':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToUndo.taskId) {
                return { ...task, dueDate: actionToUndo.newDueDate };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'priorityChange':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToUndo.taskId) {
                return { ...task, priority: actionToUndo.newPriority };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'archiveCompleted':
          setArchivedTasks((currentArchivedTasks) => {
            const lastCompletedTasks = tasks.filter((task) => task.completed);
            return currentArchivedTasks.slice(0, currentArchivedTasks.length - lastCompletedTasks.length);
          });
          break;
        default:
          break;
      }
    }
  }

  function handleRedo() {
    if (currentActionIndex < actionHistory.length - 1) {
      setCurrentActionIndex((index) => index + 1);
      const actionToRedo = actionHistory[currentActionIndex + 1];

      switch (actionToRedo.type) {
        case 'add':
          setTasks((currentTasks) => currentTasks.filter((task) => task.id !== actionToRedo.taskId));
          break;
        case 'toggleComplete':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToRedo.taskId) {
                return { ...task, completed: !task.completed };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'delete':
          setTasks((currentTasks) => [...currentTasks, actionToRedo.task]);
          break;
        case 'edit':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToRedo.taskId) {
                return { ...task, title: actionToRedo.newTitle };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'dueDateChange':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToRedo.taskId) {
                return { ...task, dueDate: actionToRedo.newDueDate };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'priorityChange':
          setTasks((currentTasks) => {
            const updatedTasks = currentTasks.map((task) => {
              if (task.id === actionToRedo.taskId) {
                return { ...task, priority: actionToRedo.newPriority };
              } else {
                return task;
              }
            });
            return updatedTasks;
          });
          break;
        case 'archiveCompleted':
          setArchivedTasks((currentArchivedTasks) => {
            const lastCompletedTasks = tasks.filter((task) => task.completed);
            return [...currentArchivedTasks, ...lastCompletedTasks];
          });
          break;
        default:
          break;
      }
    }
  }

  // Function to handle task sorting
  const sortedTasks = tasks.slice().sort((a, b) => {
    if (sort === 'none') return 0;
    if (sort === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sort === 'dueDate') {
      return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
    }
    if (sort === 'creationDate') {
      return b.id.localeCompare(a.id);
    }
    return 0;
  });

  // Function to handle task filtering
  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed && (!showArchived || task.archived);
    if (filter === 'remaining') return !task.completed && (!showArchived || task.archived);
    return true;
  });

  // Count of completed tasks
  const completedTasksCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="new-action-form">
        <div className="new-action-form-row">
          <label htmlFor="task">Task List</label>
          <input value={newTask} onChange={(e) => setNewTask(e.target.value)} type="text" id="task" />
        </div>
        <button className="btn">Add Task</button>
      </form>

      {/* Task Filter Buttons */}
      <div className="task-filter-buttons">
        <button onClick={() => setFilter('all')}>All Tasks</button>
        <button onClick={() => setFilter('completed')}>Completed Tasks</button>
        <button onClick={() => setFilter('remaining')}>Remaining Tasks</button>
        <button onClick={handleArchiveCompletedTasks}>Archive Completed</button>
      </div>

      {/* Task Sorting Dropdown */}
      <div className="task-sort-dropdown">
        <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">None</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="creationDate">Creation Date</option>
        </select>
      </div>

      {/* Task List */}
      <h1 className="header">Task List</h1>
      <p>Completed Tasks: {completedTasksCount}</p>
      <ul className="task-list">
        {filteredTasks.length === 0 && <li>No tasks to display.</li>}
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.priority}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              {task.title}
            </label>
            <button className="btn btn-danger" onClick={() => handleDeleteTask(task.id)}>
              <i className="fas fa-trash"></i>
            </button>
            <button
              className="btn btn-edit"
              onClick={() => {
                const newTitle = prompt('Edit Task:', task.title);
                if (newTitle !== null && newTitle.trim() !== '') {
                  handleEditTask(task.id, newTitle);
                }
              }}
            >
              Edit
            </button>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => handleDueDateChange(task.id, e.target.value)}
            />
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(task.id, e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </li>
        ))}
      </ul>

      {/* Archive List */}
      <h1 className="header">Archived Tasks</h1>
      <ul className="task-list">
        {archivedTasks.length === 0 && <li>No archived tasks.</li>}
        {archivedTasks.map((task) => (
          <li key={task.id} className={task.priority}>
            {task.title}
            <button
              className="btn btn-restore"
              onClick={() => {
                setArchivedTasks((currentArchivedTasks) =>
                  currentArchivedTasks.filter((archivedTask) => archivedTask.id !== task.id)
                );
                setTasks((currentTasks) => [...currentTasks, task]);
              }}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>

      {/* Undo and Redo Buttons */}
      <div className="undo-redo-buttons">
        <button onClick={handleUndo} disabled={currentActionIndex < 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={currentActionIndex >= actionHistory.length - 1}>
          Redo
        </button>
      </div>
    </div>
  );
}
