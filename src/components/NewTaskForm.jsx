import { useState } from 'react';

function NewTaskForm({ onAddTask }) {
  const [newTask, setNewTask] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!newTask.trim()) return // prevent adding empty tasks

    onAddTask({
      id: crypto.randomUUID(),
      title: newTask,
      completed: false
    })

    setNewTask('')
  }

  return (
    <form onSubmit={handleSubmit} className="new-action-form">
      <div className="new-action-form-row">
        <label htmlFor="task">Task List</label>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          type="text"
          id='task'
        />
      </div>
      <button className='btn'>Add Task</button>
    </form>
  )
}
