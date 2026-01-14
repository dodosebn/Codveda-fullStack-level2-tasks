import React from "react";
import type { Task } from "../pages/types"; 

interface TasksFooterProps {
  tasks: Task[];
  filteredAndSortedTasks: Task[];
  totalCount: number;
  filter: "all" | "completed" | "active" | string;
}

const TasksFooter: React.FC<TasksFooterProps> = ({
  tasks,
  filteredAndSortedTasks,
  totalCount,
  filter,
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mt-8 text-center text-gray-500 text-sm">
      <p>
        Showing {filteredAndSortedTasks.length} of {totalCount} tasks
        {filter !== "all" && ` (filtered by ${filter})`}
      </p>
      <p className="mt-1">
        Click on a task to edit, or use the checkbox to mark as complete
      </p>
    </div>
  );
};

export default TasksFooter;
