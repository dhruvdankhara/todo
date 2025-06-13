import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "./store/todosSlice";

import FloatingNavbar from "./components/FloatingNavbar";
import SearchAndFilters from "./components/SearchAndFilters";
import TodosContainer from "./components/TodosContainer";
import StatsPanel from "./components/StatsPanel";
import ModalManager from "./components/ModalManager";

import { useUIStates } from "./hooks/useUIStates";
import { useModalStates } from "./hooks/useModalStates";
import { useTodosFiltering } from "./hooks/useTodosFiltering";

const TodoApp = () => {
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
  return (
    <div className="min-h-screen bg-gray-900">
      <FloatingNavbar
        view={uiStates.view}
        setView={uiStates.setView}
        onCreateTodo={modalStates.handleCreateTodo}
        showMobileMenu={uiStates.showMobileMenu}
        setShowMobileMenu={uiStates.setShowMobileMenu}
      />

      <main className="pb-8 pt-20 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {uiStates.view === "stats" ? (
            <StatsPanel />
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>

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
    </div>
  );
};

export default TodoApp;
