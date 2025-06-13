import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import TodosList from "./TodosList";
import PropTypes from "prop-types";

const TodosContainer = ({
  loading,
  error,
  todos,
  layout,
  searchTerm,
  filterPriority,
  filterStatus,
  onCreateTodo,
  onEditTodo,
  onViewDetails,
  onAddSubtask,
  onAddAttachment,
  onAddLink,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (todos.length === 0) {
    return (
      <EmptyState
        searchTerm={searchTerm}
        filterPriority={filterPriority}
        filterStatus={filterStatus}
        onCreateTodo={onCreateTodo}
      />
    );
  }

  return (
    <TodosList
      todos={todos}
      layout={layout}
      onEdit={onEditTodo}
      onViewDetails={onViewDetails}
      onAddSubtask={onAddSubtask}
      onAddAttachment={onAddAttachment}
      onAddLink={onAddLink}
    />
  );
};

TodosContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  todos: PropTypes.array.isRequired,
  layout: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  filterPriority: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  onCreateTodo: PropTypes.func.isRequired,
  onEditTodo: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onAddSubtask: PropTypes.func.isRequired,
  onAddAttachment: PropTypes.func.isRequired,
  onAddLink: PropTypes.func.isRequired,
};

TodosContainer.defaultProps = {
  error: null,
};

export default TodosContainer;
