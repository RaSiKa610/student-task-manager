import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  // Add task states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");

  // UI states
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [search, setSearch] = useState("");

  // Edit modal
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    const res = await fetchTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /* =========================
     ADD TASK
     ========================= */
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({
      title,
      description,
      priority,
      dueDate: dueDate || null,
    });

    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDate("");

    loadTasks();
  };

  /* =========================
     UPDATE TASK
     ========================= */
  const handleUpdateTask = async () => {
    await updateTask(editingTask._id, editingTask);
    setEditingTask(null);
    loadTasks();
  };

  const toggleComplete = async (task) => {
    await updateTask(task._id, {
      completed: !task.completed,
    });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  /* =========================
     FILTER + SEARCH + SORT
     ========================= */
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    }
    return 0;
  });

  return (
    <div className="app-container">
      <h1>Student Task Manager</h1>

      {/* ================= ADD TASK FORM ================= */}
      <form className="add-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
        />

        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>


      {/* ================= SEARCH + SORT ================= */}
      <div className="top-controls">
        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="none">No Sorting</option>
          <option value="priority">Sort by Priority</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>
      </div>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* ================= TASK LIST ================= */}
      <ul>
        {sortedTasks.map((task) => {
          const isOverdue =
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            !task.completed;

          return (
            <li
              key={task._id}
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
                  <div className="task-description">
                    {task.description}
                  </div>
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
        })}
      </ul>

      {/* ================= EDIT MODAL ================= */}
      {editingTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Task</h3>

            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
            />

            <textarea
              value={editingTask.description || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
            />

            <select
              value={editingTask.priority}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  priority: e.target.value,
                })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              value={editingTask.dueDate?.slice(0, 10) || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  dueDate: e.target.value,
                })
              }
            />

            <button onClick={handleUpdateTask}>Save</button>
            <button onClick={() => setEditingTask(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
