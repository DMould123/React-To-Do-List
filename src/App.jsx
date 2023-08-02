import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('none'); // Sorting state, options: none, priority, dueDate, creationDate
  const [showArchived, setShowArchived] = useState(false);

  // Load tasks from LocalStorage on app startup
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to LocalStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleSubmit(e) {
    e.preventDefault();

    setTasks(ongoingTasks => {
      return [
        ...ongoingTasks,
        {
          id: crypto.randomUUID(),
          title: newTask,
          completed: false,
          dueDate: null,
          priority: 'medium', // default priority is medium
        },
      ];
    });

    setNewTask(''); // clear the input field after adding the task
  }

  function handleToggleComplete(taskId) {
    setTasks(tasks => {
      return tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      });
    });
  }

  function handleDeleteTask(taskId) {
    setTasks(ongoingTasks => {
      return ongoingTasks.filter(task => task.id !== taskId);
    });
  }

  function handleEditTask(taskId, newTitle) {
    setTasks(tasks => {
      return tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, title: newTitle };
        } else {
          return task;
        }
      });
    });
  }

  function handleDueDateChange(taskId, newDueDate) {
    setTasks(tasks => {
      return tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, dueDate: newDueDate };
        } else {
          return task;
        }
      });
    });
  }

  function handlePriorityChange(taskId, newPriority) {
    setTasks(tasks => {
      return tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, priority: newPriority };
        } else {
          return task;
        }
      });
    });
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
  const filteredTasks = sortedTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed && (!showArchived || task.archived);
    if (filter === 'remaining') return !task.completed && (!showArchived || task.archived);
    return true;
  });

  // Count of completed tasks
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="new-action-form">
        <div className="new-action-form-row">
          <label htmlFor="task">Task List</label>
          <input value={newTask} onChange={e => setNewTask(e.target.value)} type="text" id="task" />
        </div>
        <button className="btn">Add Task</button>
      </form>

      {/* Task Filter Buttons */}
      <div className="task-filter-buttons">
        <button onClick={() => setFilter('all')}>All Tasks</button>
        <button onClick={() => setFilter('completed')}>Completed Tasks</button>
        <button onClick={() => setFilter('remaining')}>Remaining Tasks</button>
      </div>

      {/* Task Sorting Dropdown */}
      <div className="task-sort-dropdown">
        <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sort} onChange={e => setSort(e.target.value)}>
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
        {filteredTasks.length === 0 && "There are currently no tasks to display."}
        {filteredTasks.map(task => (
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
              onChange={e => handleDueDateChange(task.id, e.target.value)}
            />
            <select
              value={task.priority}
              onChange={e => handlePriorityChange(task.id, e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
