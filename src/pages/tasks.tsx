import React, { useState, useEffect, useRef } from "react";
import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import type { Task, TaskFormData } from "./types";
import {
  FaTrashAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaCheck,
  FaClipboardList,

  FaSpinner,
} from "react-icons/fa";
import TaskIntro from "../components/taskIntro";

const STORAGE_KEY = "tasks";

// Task filter types
type FilterType = "all" | "active" | "completed";
type SortType = "newest" | "oldest" | "alphabetical";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addingTask, setAddingTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [showForm, setShowForm] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
  });

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTaskId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingTaskId) {
          setEditingTaskId(null);
        }
        if (showForm) {
          setShowForm(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [editingTaskId, showForm]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/todos`);

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setAddingTask(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/postTodos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setFormData({ title: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add task. Please try again.");
    } finally {
      setAddingTask(false);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };

    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updated.completed }),
      });

      if (!res.ok) throw new Error("Failed to update task");
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      setError("Failed to update task. Please try again.");
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");
    } catch (err) {
      console.error(err);
      setTasks((prev) => [...prev, task]);
      setError("Failed to delete task. Please try again.");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (id: string) => {
    if (!editingTitle.trim()) {
      setEditingTaskId(null);
      return;
    }

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: editingTitle } : t))
    );

    setEditingTaskId(null);

    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle }),
      });

      if (!res.ok) throw new Error("Failed to update task");
    } catch (err) {
      console.error(err);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      setError("Failed to update task. Please try again.");
    }
  };

  const filteredAndSortedTasks = React.useMemo(() => {
    let result = [...tasks];

    if (filter === "active") {
      result = result.filter((task) => !task.completed);
    } else if (filter === "completed") {
      result = result.filter((task) => task.completed);
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    } else if (sort === "alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [tasks, filter, sort]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen ">
      <TaskIntro />
      <div className="mb-8">
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Task Overview
              </h2>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {totalCount}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedCount}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalCount - completedCount}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "primary" : "secondary"}
                  onClick={() => setFilter("all")}
                  className="text-sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === "active" ? "primary" : "secondary"}
                  onClick={() => setFilter("active")}
                  className="text-sm"
                >
                  Active
                </Button>
                <Button
                  variant={filter === "completed" ? "primary" : "secondary"}
                  onClick={() => setFilter("completed")}
                  className="text-sm"
                >
                  Completed
                </Button>
              </div>

              <div className="flex gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8 bg-white shadow-lg">
        <div className="p-6">
          {showForm ? (
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="What needs to be done?"
                  required
                  autoFocus
                  className="text-lg"
                />

                <Input
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add more details..."
                  // multiline
                  // rows={3}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addingTask || !formData.title.trim()}
                    className="px-6"
                  >
                    {addingTask ? (
                      <>
                        Adding...
                      </>
                    ) : (
                      <>
                        Add Task
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              variant="secondary"
              className="w-full py-4 border-2 mx-auto flex justify-center border-dashed border-blue-500"
            >
              <span className="mt-1"><FaPlus className="mr-2" /></span>
              Add New Task
            </Button>
          )}
        </div>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-500 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <Card className="text-center py-16 bg-white shadow-lg">
          <FaClipboardList className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === "all"
              ? "Get started by adding your first task!"
              : "Try changing your filter to see more tasks."}
          </p>
          {filter !== "all" && (
            <Button onClick={() => setFilter("all")} variant="secondary">
              Show All Tasks
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedTasks.map((task) => (
            <Card
              key={task.id}
              className={`
                flex justify-between items-center p-4 
                transition-all duration-200 hover:shadow-md
                ${task.completed ? "bg-green-50 border-green-200" : "bg-white"}
                ${editingTaskId === task.id ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-colors flex-shrink-0
                    ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-blue-500"
                    }
                  `}
                  aria-label={
                    task.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                >
                  {task.completed && <FaCheck size={12} />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingTaskId === task.id ? (
                    <input
                      ref={editInputRef}
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(task.id);
                        if (e.key === "Escape") setEditingTaskId(null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                  ) : (
                    <div className="min-w-0">
                      <h3
                        className={`
                        text-lg font-medium break-words
                        ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }
                      `}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm mt-1 truncate">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">
                          {task.createdAt &&
                            new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        {task.completed && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0 ml-4">
                {editingTaskId === task.id ? (
                  <>
                    <Button
                      onClick={() => saveEdit(task.id)}
                      variant="primary"
                      className="px-3 py-2"
                      disabled={!editingTitle.trim()}
                    >
                      <FaSave />
                    </Button>
                    <Button
                      onClick={() => setEditingTaskId(null)}
                      variant="secondary"
                      className="px-3 py-2"
                    >
                      <FaTimes />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => startEdit(task)}
                      variant="secondary"
                      className="px-3 py-2"
                      aria-label="Edit task"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this task?"
                          )
                        ) {
                          deleteTask(task.id);
                        }
                      }}
                      variant="secondary"
                      className="px-3 py-2 text-red-600 hover:bg-red-50"
                      aria-label="Delete task"
                    >
                      <FaTrashAlt />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tasks.length > 0 && (
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Showing {filteredAndSortedTasks.length} of {totalCount} tasks
            {filter !== "all" && ` (filtered by ${filter})`}
          </p>
          <p className="mt-1">
            Click on a task to edit, or use the checkbox to mark as complete
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
