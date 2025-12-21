import TaskCard from "./TaskCard";

function TaskList({
  tasks,
  toggleComplete,
  handleDelete,
  setEditingTask,
}) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          toggleComplete={toggleComplete}
          handleDelete={handleDelete}
          setEditingTask={setEditingTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
