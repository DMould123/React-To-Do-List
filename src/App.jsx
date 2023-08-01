import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

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
      return [...ongoingTasks, {
        id: crypto.randomUUID(), title: newTask, completed: false, dueDate: null
      }];
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

  // Function to handle task filtering
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'remaining') return !task.completed;
    return true;
  });

  // Count of completed tasks
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="new-action-form">
        <div className="new-action-form-row">
          <label htmlFor="task">Task List</label>
          <input value={newTask} onChange={e => setNewTask(e.target.value)} type="text" id='task' />
        </div>
        <button className='btn'>Add Task</button>
      </form>

      {/* Task Filter Buttons */}
      <div className="task-filter-buttons">
        <button onClick={() => setFilter('all')}>All Tasks</button>
        <button onClick={() => setFilter('completed')}>Completed Tasks</button>
        <button onClick={() => setFilter('remaining')}>Remaining Tasks</button>
      </div>

      {/* Task List */}
      <h1 className='header'>Task List</h1>
      <p>Completed Tasks: {completedTasksCount}</p>
      <ul className='task-list'>
        {filteredTasks.length === 0 && "There are currently no tasks to display."}
        {filteredTasks.map(task => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              {task.title}
            </label>
            <button className='btn btn-danger' onClick={() => handleDeleteTask(task.id)}>
              <i className='fas fa-trash'></i>
            </button>
            <button className='btn btn-edit' onClick={() => {
              const newTitle = prompt('Edit Task:', task.title);
              if (newTitle !== null && newTitle.trim() !== '') {
                handleEditTask(task.id, newTitle);
              }
            }}>
              Edit
            </button>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => handleDueDateChange(task.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
