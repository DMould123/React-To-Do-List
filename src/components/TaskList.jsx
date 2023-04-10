export default function App() {
  const [tasks, setTasks] = useState([])

  function handleAddTask(newTask) {
    setTasks(ongoingTasks => [...ongoingTasks, newTask])
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
    setTasks(ongoingTasks => ongoingTasks.filter(task => task.id !== taskId))
  }

  return (
    <>
      <NewTaskForm onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}
