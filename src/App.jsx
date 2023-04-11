  import { useState } from 'react';
  import './styles.css';


  export default function App() {
    const [newTask, setNewTask] = useState('')
    const [tasks, setTasks] = useState([])

    function handleSubmit(e) {
      e.preventDefault()

      setTasks(ongoingTasks => {
        return [... ongoingTasks, {
          id: crypto.randomUUID(), title: newTask, completed: false
        }]
      })

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

    return (
      <>
        <form onSubmit={handleSubmit} className="new-action-form">
          <div className="new-action-form-row">
            <label htmlFor="task">Task List</label>
            <input value={newTask} onChange={e => setNewTask(e.target.value)} type="text" id='task' />
          </div>
          <button className='btn'>Add Task</button>
        </form>

        <h1 className='header'> Task List</h1>
        <ul className='task-list'>
          {tasks.length === 0 && "There are currently no remaining tasks"}
          {tasks.map(task => (
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
            </li>
          ))}
        </ul>
      </>
    );
  }
