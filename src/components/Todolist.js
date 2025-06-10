import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://demo2.z-bit.ee/tasks', {
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
    fetchTasks();
  }, [token]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(
        'http://demo2.z-bit.ee/tasks',
        { name: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      await axios.put(
        `http://demo2.z-bit.ee/tasks/${taskId}`,
        { done: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, done: !task.done } : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://demo2.z-bit.ee/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const updateTaskName = async (taskId, newName) => {
    try {
      await axios.put(
        `http://demo2.z-bit.ee/tasks/${taskId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, name: newName } : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id, task.done)}
            />
            <input
              type="text"
              value={task.name}
              onChange={(e) => updateTaskName(task.id, e.target.value)}
              style={{ border: 'none', background: 'transparent' }}
            />
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;