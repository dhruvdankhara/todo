import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  List,
  Grid,
  SortAsc,
  SortDesc,
  LogOut,
  User,
} from "lucide-react";
import { fetchTodos } from "./store/todosSlice";
import { logout } from "./store/authSlice";
import { cn } from "./utils/cn";

// Components
import TodoCard from "./components/TodoCard";
import TodoModal from "./components/TodoModal";
import ModernTodoDetailModal from "./components/ModernTodoDetailModal";
import FileUploadModal from "./components/FileUploadModal";
import LinkModal from "./components/LinkModal";
import StatsPanel from "./components/StatsPanel";

const TodoApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { todos, loading, error } = useSelector((state) => state.todos);
  const { user } = useSelector((state) => state.auth);

  // UI Statte
  const [view, setView] = useState("todos");
  const [layout, setLayout] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("desc");
  // Modal States
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // Filter and sort todos
  const filteredAndSortedTodos = React.useMemo(() => {
    let filtered = [...todos];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((todo) => todo.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "completed") {
        filtered = filtered.filter((todo) => todo.isCompleted);
      } else if (filterStatus === "pending") {
        filtered = filtered.filter((todo) => !todo.isCompleted);
      }
    } // Sort
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

  const handleCreateTodo = () => {
    setEditingTodo(null);
    setShowTodoModal(true);
  };
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowTodoModal(true);
  };

  const handleViewDetails = (todo) => {
    setSelectedTodo(todo);
    setShowDetailModal(true);
  };

  const handleAddSubtask = () => {
    // For now, just show a placeholder - subtask functionality can be added later
    alert("Subtask functionality coming soon!");
  };

  const handleAddAttachment = (todo) => {
    setSelectedTodo(todo);
    setShowFileModal(true);
  };

  const handleAddLink = (todo) => {
    setSelectedTodo(todo);
    setShowLinkModal(true);
  };
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">TodoApp</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView("todos")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    view === "todos"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  )}
                >
                  <List className="w-4 h-4 inline mr-1" />
                  Todos
                </button>
                <button
                  onClick={() => setView("stats")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    view === "stats"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  )}
                >
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Stats
                </button>
              </div>{" "}
            </div>

            <div className="flex items-center space-x-4">
              {view === "todos" && (
                <button
                  onClick={handleCreateTodo}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Todo
                </button>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "stats" ? (
          <StatsPanel />
        ) : (
          <>
            {/* Filters and Search */}
            <div className="mb-8 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters and Layout */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Priority Filter */}
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Todos</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="created">Created Date</option>
                      <option value="updated">Updated Date</option>
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                      <option value="dueDate">Due Date</option>
                    </select>
                    <button
                      onClick={toggleSortOrder}
                      className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Layout Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLayout("grid")}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      layout === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white"
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      layout === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                <span className="ml-3 text-gray-400">Loading todos...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Todos Grid/List */}
            {!loading && !error && (
              <>
                {filteredAndSortedTodos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      {searchTerm ||
                      filterPriority !== "all" ||
                      filterStatus !== "all" ? (
                        <div>
                          <Filter className="w-12 h-12 mx-auto mb-4" />
                          <p className="text-lg">No todos match your filters</p>
                          <p className="text-sm">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Plus className="w-12 h-12 mx-auto mb-4" />
                          <p className="text-lg">No todos yet</p>
                          <p className="text-sm">
                            Create your first todo to get started
                          </p>
                        </div>
                      )}
                    </div>
                    {!searchTerm &&
                      filterPriority === "all" &&
                      filterStatus === "all" && (
                        <button
                          onClick={handleCreateTodo}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Create First Todo
                        </button>
                      )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      layout === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    )}
                  >
                    {" "}
                    {filteredAndSortedTodos.map((todo) => (
                      <TodoCard
                        key={todo._id}
                        todo={todo}
                        onEdit={handleEditTodo}
                        onViewDetails={handleViewDetails}
                        onAddSubtask={handleAddSubtask}
                        onAddAttachment={handleAddAttachment}
                        onAddLink={handleAddLink}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      {/* Modals */}
      <TodoModal
        isOpen={showTodoModal}
        onClose={() => {
          setShowTodoModal(false);
          setEditingTodo(null);
        }}
        todo={editingTodo}
      />
      <FileUploadModal
        isOpen={showFileModal}
        onClose={() => {
          setShowFileModal(false);
          setSelectedTodo(null);
        }}
        todo={selectedTodo}
      />{" "}
      <LinkModal
        isOpen={showLinkModal}
        onClose={() => {
          setShowLinkModal(false);
          setSelectedTodo(null);
        }}
        todo={selectedTodo}
      />{" "}
      <ModernTodoDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTodo(null);
        }}
        todo={selectedTodo}
      />
    </div>
  );
};

export default TodoApp;
