function TaskCard({ task, toggleComplete, handleDelete, setEditingTask }) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    !task.completed;

  return (
    <li
      className={`${task.completed ? "completed" : ""} ${
        isOverdue ? "overdue" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task)}
      />

      <div className={`task-title ${task.completed ? "completed" : ""}`}>
        {task.title}

        {task.description && (
          <div className="task-description">{task.description}</div>
        )}

        <div className="meta">
          <span className={`priority ${task.priority}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <> • Due: {new Date(task.dueDate).toLocaleDateString()}</>
          )}
        </div>
      </div>

      <button onClick={() => setEditingTask(task)}>Edit</button>
      <button
        className="delete-btn"
        onClick={() => handleDelete(task._id)}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskCard;
