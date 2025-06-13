import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "../store/todosSlice";

import SearchAndFilters from "../components/SearchAndFilters";
import TodosContainer from "../components/TodosContainer";
import ModalManager from "../components/ModalManager";

import { useUIStates } from "../hooks/useUIStates";
import { useModalStates } from "../hooks/useModalStates";
import { useTodosFiltering } from "../hooks/useTodosFiltering";

const TodosPage = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.todos);

  const uiStates = useUIStates();
  const modalStates = useModalStates();

  const filteredAndSortedTodos = useTodosFiltering(
    todos,
    uiStates.searchTerm,
    uiStates.filterPriority,
    uiStates.filterStatus,
    uiStates.sortBy,
    uiStates.sortOrder
  );
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // Listen for custom event from FloatingNavbar
  useEffect(() => {
    const handleOpenTodoModal = () => {
      modalStates.handleCreateTodo();
    };

    window.addEventListener("openTodoModal", handleOpenTodoModal);

    return () => {
      window.removeEventListener("openTodoModal", handleOpenTodoModal);
    };
  }, [modalStates]);

  return (
    <>
      {" "}
      {/* Page Header */}
      <div className="mb-8 rounded-3xl border border-gray-700/30 bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-4 shadow-lg backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              My Todos
            </h1>
            <p className="mt-1 text-sm text-gray-400 sm:mt-2 sm:text-base">
              Manage your tasks and stay organized
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 sm:gap-4 sm:text-sm">
            <span className="flex items-center space-x-1 rounded-full bg-gray-800/70 px-2 py-1 backdrop-blur-sm sm:space-x-2 sm:px-3 sm:py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 sm:h-2 sm:w-2"></span>
              <span>{todos?.length || 0} Total</span>
            </span>
            <span className="flex items-center space-x-1 rounded-full bg-gray-800/70 px-2 py-1 backdrop-blur-sm sm:space-x-2 sm:px-3 sm:py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 sm:h-2 sm:w-2"></span>
              <span>
                {todos?.filter((todo) => todo.completed)?.length || 0} Done
              </span>
            </span>
            <span className="flex items-center space-x-1 rounded-full bg-gray-800/70 px-2 py-1 backdrop-blur-sm sm:space-x-2 sm:px-3 sm:py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 sm:h-2 sm:w-2"></span>
              <span>
                {todos?.filter((todo) => !todo.completed)?.length || 0} Pending
              </span>
            </span>
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={uiStates.searchTerm}
        setSearchTerm={uiStates.setSearchTerm}
        filterPriority={uiStates.filterPriority}
        setFilterPriority={uiStates.setFilterPriority}
        filterStatus={uiStates.filterStatus}
        setFilterStatus={uiStates.setFilterStatus}
        sortBy={uiStates.sortBy}
        setSortBy={uiStates.setSortBy}
        sortOrder={uiStates.sortOrder}
        toggleSortOrder={uiStates.toggleSortOrder}
        layout={uiStates.layout}
        setLayout={uiStates.setLayout}
      />{" "}
      {/* Todos Container */}
      <TodosContainer
        loading={loading}
        error={error}
        todos={filteredAndSortedTodos}
        layout={uiStates.layout}
        searchTerm={uiStates.searchTerm}
        filterPriority={uiStates.filterPriority}
        filterStatus={uiStates.filterStatus}
        onCreateTodo={modalStates.handleCreateTodo}
        onEditTodo={modalStates.handleEditTodo}
        onViewDetails={modalStates.handleViewDetails}
        onAddSubtask={modalStates.handleAddSubtask}
        onAddAttachment={modalStates.handleAddAttachment}
        onAddLink={modalStates.handleAddLink}
      />
      {/* Modals */}
      <ModalManager
        showTodoModal={modalStates.showTodoModal}
        showFileModal={modalStates.showFileModal}
        showLinkModal={modalStates.showLinkModal}
        showDetailModal={modalStates.showDetailModal}
        editingTodo={modalStates.editingTodo}
        selectedTodo={modalStates.selectedTodo}
        onCloseTodoModal={modalStates.onCloseTodoModal}
        onCloseFileModal={modalStates.onCloseFileModal}
        onCloseLinkModal={modalStates.onCloseLinkModal}
        onCloseDetailModal={modalStates.onCloseDetailModal}
      />
    </>
  );
};

export default TodosPage;
