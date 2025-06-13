import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { fetchTodos } from "./store/todosSlice";
import { cn } from "./utils/cn";

// Components
import TodoCard from "./components/TodoCard";
import TodoModal from "./components/TodoModal";
import ModernTodoDetailModal from "./components/ModernTodoDetailModal";
import FileUploadModal from "./components/FileUploadModal";
import LinkModal from "./components/LinkModal";
import StatsPanel from "./components/StatsPanel";
import FloatingNavbar from "./components/FloatingNavbar";

const TodoApp = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.todos);
  // UI State
  const [view, setView] = useState("todos");
  const [layout, setLayout] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Floating Navbar */}
      <FloatingNavbar
        view={view}
        setView={setView}
        onCreateTodo={handleCreateTodo}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      {/* Main Content with top padding for floating navbar */}
      <main className="pt-20 sm:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === "stats" ? (
            <StatsPanel />
          ) : (
            <>
              {/* Filters and Search */}
              <div className="mb-6 sm:mb-8 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search todos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>{" "}
                {/* Filters and Layout Controls */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  {/* Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    {/* Priority Filter */}
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="all">All Todos</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Sort Controls */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <option value="created">Created Date</option>
                        <option value="updated">Updated Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                        <option value="dueDate">Due Date</option>
                      </select>
                      <button
                        onClick={toggleSortOrder}
                        className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700"
                        title={`Sort ${
                          sortOrder === "asc" ? "Ascending" : "Descending"
                        }`}
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
                    <span className="text-sm text-gray-400 hidden sm:inline">
                      View:
                    </span>
                    <button
                      onClick={() => setLayout("grid")}
                      className={cn(
                        "p-2.5 rounded-xl transition-all duration-200",
                        layout === "grid"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                          : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLayout("list")}
                      className={cn(
                        "p-2.5 rounded-xl transition-all duration-200",
                        layout === "list"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                          : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16 sm:py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="ml-3 text-gray-400">Loading todos...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
                  <p className="text-red-400 text-center">{error}</p>
                </div>
              )}

              {/* Todos Content */}
              {!loading && !error && (
                <>
                  {filteredAndSortedTodos.length === 0 ? (
                    <div className="text-center py-16 sm:py-20">
                      <div className="text-gray-400 mb-6">
                        {searchTerm ||
                        filterPriority !== "all" ||
                        filterStatus !== "all" ? (
                          <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                              <Filter className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-lg sm:text-xl font-medium">
                                No todos match your filters
                              </p>
                              <p className="text-sm sm:text-base text-gray-500 mt-2">
                                Try adjusting your search or filters
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Plus className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <p className="text-lg sm:text-xl font-medium">
                                No todos yet
                              </p>
                              <p className="text-sm sm:text-base text-gray-500 mt-2">
                                Create your first todo to get started
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {!searchTerm &&
                        filterPriority === "all" &&
                        filterStatus === "all" && (
                          <button
                            onClick={handleCreateTodo}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
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
                          ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                          : "space-y-3 sm:space-y-4"
                      )}
                    >
                      {filteredAndSortedTodos.map((todo) => (
                        <TodoCard
                          key={todo._id}
                          todo={todo}
                          layout={layout}
                          onEdit={handleEditTodo}
                          onViewDetails={handleViewDetails}
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
        </div>
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
