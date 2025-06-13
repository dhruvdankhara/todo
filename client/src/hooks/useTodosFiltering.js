import { useMemo } from "react";

export const useTodosFiltering = (
  todos,
  searchTerm,
  filterPriority,
  filterStatus,
  sortBy,
  sortOrder
) => {
  return useMemo(() => {
    let filtered = [...todos];

    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((todo) => todo.priority === filterPriority);
    }

    if (filterStatus !== "all") {
      if (filterStatus === "completed") {
        filtered = filtered.filter((todo) => todo.isCompleted);
      } else if (filterStatus === "pending") {
        filtered = filtered.filter((todo) => !todo.isCompleted);
      }
    }

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "created": {
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        }
        case "updated": {
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        }
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        }
        case "title": {
          aValue = a.content.toLowerCase();
          bValue = b.content.toLowerCase();
          break;
        }
        case "dueDate": {
          aValue = a.dueDate ? new Date(a.dueDate) : new Date("2099-12-31");
          bValue = b.dueDate ? new Date(b.dueDate) : new Date("2099-12-31");
          break;
        }
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [todos, searchTerm, filterPriority, filterStatus, sortBy, sortOrder]);
};
