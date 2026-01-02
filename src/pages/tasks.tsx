// pages/Tasks.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
// import { useAuth } from '../context/AuthContext';
import type { Task, TaskFormData } from '../types/tasks';
import Button from '../components/button';
import Card from '../components/card';
import Input from '../components/input';
import { useAuth } from '../context/authContext';
const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({ title: '', description: '' });
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const response = await api.post('/tasks', formData);
      setTasks([...tasks, response.data]);
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const response = await api.put(`/tasks/${id}`, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={logout} variant="secondary">Logout</Button>
      </div>

      <Card className="mb-6">
        <form onSubmit={handleSubmit}>
          <Input
            label="New Task"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="What needs to be done?"
            required
          />
          <Button type="submit" className="w-full">Add Task</Button>
        </form>
      </Card>

      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <Card className="text-center py-8 text-gray-500">
          No tasks yet. Add one above!
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <Card key={task.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 mr-3"
                />
                <div>
                  <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </span>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800"
                variant="secondary"
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;