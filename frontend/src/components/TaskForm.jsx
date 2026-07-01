import { useState } from 'react';
import api from '../api/axios';

const TaskForm = ({ task, onClose, onSuccess }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!task;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      title,
      description,
      priority,
      due_date: dueDate || null,
    };
    try {
      if (isEditing) {
        await api.patch(`/tasks/${task.id}/`, payload);
      } else {
        await api.post('/tasks/', payload);
      }
      onSuccess();
    } catch (err) {
      setError('Failed to save task. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content p-3">
          <h4>{isEditing ? 'Edit Task' : 'New Task'}</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end" style={{ gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;