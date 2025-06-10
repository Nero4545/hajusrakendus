import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', desc: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://demo2.z-bit.ee/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const response = await axios.post(
        'https://demo2.z-bit.ee/tasks',
        { title: newTask.title, desc: newTask.desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', desc: '' });
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(
        `https://demo2.z-bit.ee/tasks/${taskId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, ...response.data } : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://demo2.z-bit.ee/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Task</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleNewTaskChange}
            placeholder="Task title"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            name="desc"
            value={newTask.desc}
            onChange={handleNewTaskChange}
            placeholder="Task description"
            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
          />
        </div>
        <button onClick={addTask}>Add Task</button>
      </div>
      
      <h3>Your Tasks</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li 
            key={task.id} 
            style={{ 
              marginBottom: '15px', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              textDecoration: task.marked_as_done ? 'line-through' : 'none',
              opacity: task.marked_as_done ? 0.7 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={task.marked_as_done}
                onChange={() => updateTask(task.id, { 
                  marked_as_done: !task.marked_as_done 
                })}
                style={{ marginRight: '10px' }}
              />
              <input
                type="text"
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                style={{ 
                  border: 'none', 
                  background: 'transparent',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textDecoration: task.marked_as_done ? 'line-through' : 'none',
                  flex: 1
                }}
              />
              <button 
                onClick={() => deleteTask(task.id)}
                style={{ 
                  background: '#ff6b6b', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
            
            {task.desc && (
              <div style={{ paddingLeft: '28px' }}>
                <textarea
                  value={task.desc}
                  onChange={(e) => updateTask(task.id, { desc: e.target.value })}
                  style={{ 
                    width: '100%', 
                    border: 'none',
                    background: 'transparent',
                    resize: 'vertical',
                    minHeight: '40px'
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;