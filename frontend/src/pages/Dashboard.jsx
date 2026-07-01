import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await api.get('/tasks/', { params });
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);

const toggleTheme = () => {
  setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
};

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleAddClick = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.patch(`/tasks/${task.id}/`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--text-color)' }}>My Tasks</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="btn btn-outline-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <div className="progress" style={{ height: '20px' }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${completionPercent}%` }}
          >
            {completionPercent}%
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div className="btn-group">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <button className="btn btn-success" onClick={handleAddClick}>
          + Add Task
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-muted">No tasks found.</p>
      ) : (
        <div className="list-group">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;