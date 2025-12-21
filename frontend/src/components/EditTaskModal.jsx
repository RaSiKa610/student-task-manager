function EditTaskModal({ editingTask, setEditingTask, handleUpdateTask }) {
  if (!editingTask) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Task</h3>

        <input
          value={editingTask.title}
          onChange={(e) =>
            setEditingTask({ ...editingTask, title: e.target.value })
          }
        />

        <textarea
          value={editingTask.description}
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
  );
}

export default EditTaskModal;
