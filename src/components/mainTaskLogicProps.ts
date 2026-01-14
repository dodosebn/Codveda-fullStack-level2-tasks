import type React from "react";
import type { Task, TaskFormData } from "../pages/types";

export type FilterType = "all" | "completed" | "active";

export interface MainTaskLogicProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  addingTask: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  formRef: React.RefObject<HTMLInputElement | null>;

  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;

  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  filteredAndSortedTasks: Task[];

  editingTaskId: string | null;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  editInputRef: React.RefObject<HTMLInputElement | null>;

  startEdit: (task: Task) => void;
  saveEdit: (id: string) => void;
  setEditingTaskId: React.Dispatch<React.SetStateAction<string | null>>;

  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}
