import TodoCard from "./TodoCard";
import { cn } from "../utils/cn";
import PropTypes from "prop-types";

const TodosList = ({
  todos,
  layout,
  onEdit,
  onViewDetails,
  onAddSubtask,
  onAddAttachment,
  onAddLink,
}) => {
  return (
    <div
      className={cn(
        layout === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3"
          : "space-y-3 sm:space-y-4"
      )}
    >
      {todos.map((todo) => (
        <TodoCard
          key={todo._id}
          todo={todo}
          layout={layout}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          onAddSubtask={onAddSubtask}
          onAddAttachment={onAddAttachment}
          onAddLink={onAddLink}
        />
      ))}
    </div>
  );
};

TodosList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
  layout: PropTypes.oneOf(["grid", "list"]).isRequired,
  onEdit: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onAddSubtask: PropTypes.func.isRequired,
  onAddAttachment: PropTypes.func.isRequired,
  onAddLink: PropTypes.func.isRequired,
};

export default TodosList;
