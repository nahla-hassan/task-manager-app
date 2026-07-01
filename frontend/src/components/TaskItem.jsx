const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <div className="list-group-item d-flex justify-content-between align-items-start">
      <div className="d-flex" style={{ gap: '12px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          style={{ marginTop: '4px' }}
        />
        <div>
          <h5
            className="mb-1"
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#888' : 'inherit',
            }}
          >
            {task.title}
          </h5>
          {task.description && <p className="mb-1 text-muted">{task.description}</p>}
          <div>
            <span className={`badge bg-${priorityColors[task.priority]} me-2`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="badge bg-secondary">Due: {task.due_date}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;