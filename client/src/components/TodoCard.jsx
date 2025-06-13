import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Paperclip,
  Link as LinkIcon,
  MoreVertical,
  Edit3,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { format } from "date-fns";
import { cn, getFileIcon, formatFileSize } from "../utils/cn";
import {
  toggleTodoStatus,
  deleteTodo,
  removeTodoAttachment,
  removeTodoLink,
} from "../store/todosSlice";

const priorityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

const TodoCard = ({
  todo,
  layout = "grid",
  onEdit,
  onAddAttachment,
  onAddLink,
  onViewDetails,
}) => {
  const dispatch = useDispatch();
  const [showAttachments, setShowAttachments] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const handleToggleStatus = () => {
    dispatch(toggleTodoStatus(todo._id));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      dispatch(deleteTodo(todo._id));
    }
  };

  const handleEdit = () => {
    onEdit(todo);
  };
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(todo);
    }
  };

  const handleRemoveAttachment = (attachmentId) => {
    if (window.confirm("Are you sure you want to remove this attachment?")) {
      dispatch(removeTodoAttachment({ todoId: todo._id, attachmentId }));
    }
  };

  const handleRemoveLink = (linkId) => {
    if (window.confirm("Are you sure you want to remove this link?")) {
      dispatch(removeTodoLink({ todoId: todo._id, linkId }));
    }
  };
  const completedSubtasks =
    todo.subtasks?.filter((st) => st.isCompleted).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;

  const isListLayout = layout === "list";
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-800/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-600/70 hover:shadow-xl hover:shadow-gray-900/20",
        todo.isCompleted && "opacity-75",
        isListLayout ? "flex items-center gap-4 p-4" : "p-6"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex justify-between",
          isListLayout ? "flex-1 items-center" : "mb-4 items-start"
        )}
      >
        <div
          className={cn(
            "flex flex-1 items-start space-x-3",
            isListLayout && "min-w-0"
          )}
        >
          <button
            onClick={handleToggleStatus}
            className="mt-1 text-gray-400 transition-colors hover:text-blue-400"
          >
            {todo.isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>{" "}
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "flex items-center gap-2",
                isListLayout ? "flex-wrap" : "flex-col items-start"
              )}
            >
              <h3
                className={cn(
                  "cursor-pointer font-semibold text-white transition-colors hover:text-blue-400",
                  todo.isCompleted && "text-gray-400 line-through",
                  isListLayout ? "text-base" : "text-lg"
                )}
                onClick={handleViewDetails}
              >
                {todo.content}
              </h3>{" "}
              {/* Priority in list layout */}
              {todo.priority && (
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium shadow-sm",
                    priorityColors[todo.priority]
                  )}
                >
                  {todo.priority.toUpperCase()}
                </span>
              )}
              {/* Due date in list layout */}
              {todo.dueDate && isListLayout && (
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{format(new Date(todo.dueDate), "MMM d")}</span>
                  {new Date(todo.dueDate) < new Date() && !todo.isCompleted && (
                    <AlertCircle className="ml-1 h-3 w-3 text-red-400" />
                  )}
                </div>
              )}
            </div>

            {todo.description && !isListLayout && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                {todo.description}
              </p>
            )}
          </div>
        </div>{" "}
        {/* List layout compact info */}
        {isListLayout && (
          <div className="flex items-center gap-2 rounded-2xl border border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-700/80 p-3 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col items-end gap-3 text-xs text-gray-500 md:flex-row md:items-center">
              {/* Subtasks count */}
              {totalSubtasks > 0 && (
                <span className="flex items-center gap-1">
                  <Circle className="h-3 w-3" />
                  {completedSubtasks}/{totalSubtasks}
                </span>
              )}

              {/* Links count */}
              {todo.links && todo.links.length > 0 && (
                <span className="flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" />
                  {todo.links.length}
                </span>
              )}

              <span>Created {format(new Date(todo.createdAt), "MMM d")}</span>
            </div>
          </div>
        )}{" "}
        {/* Actions Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="rounded-2xl p-2 text-gray-400 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/80 hover:text-white hover:shadow-sm">
            <MoreVertical className="h-4 w-4" />
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-2xl border border-gray-700/50 bg-gray-800/95 shadow-xl backdrop-blur-sm">
              <div className="py-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleEdit}
                      className={cn(
                        "flex w-full items-center px-4 py-2 text-left text-sm",
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      )}
                    >
                      <Edit3 className="mr-3 h-4 w-4" />
                      Edit Todo
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onAddAttachment(todo)}
                      className={cn(
                        "flex w-full items-center px-4 py-2 text-left text-sm",
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      )}
                    >
                      <Paperclip className="mr-3 h-4 w-4" />
                      Add Attachment
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onAddLink(todo)}
                      className={cn(
                        "flex w-full items-center px-4 py-2 text-left text-sm",
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      )}
                    >
                      <LinkIcon className="mr-3 h-4 w-4" />
                      Add Link
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      className={cn(
                        "flex w-full items-center px-4 py-2 text-left text-sm",
                        active ? "bg-red-600 text-white" : "text-red-400"
                      )}
                    >
                      <Trash2 className="mr-3 h-4 w-4" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {/* Grid layout only sections */}
      {!isListLayout && (
        <>
          {/* Due Date */}
          {todo.dueDate && (
            <div className="mb-3 flex items-center text-sm text-gray-400">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Due: {format(new Date(todo.dueDate), "PPP")}</span>
              {new Date(todo.dueDate) < new Date() && !todo.isCompleted && (
                <AlertCircle className="ml-2 h-4 w-4 text-red-400" />
              )}
            </div>
          )}

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                <span>Subtasks</span>
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>{" "}
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-700/70 shadow-inner">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm transition-all duration-500"
                  style={{
                    width: `${
                      totalSubtasks > 0
                        ? (completedSubtasks / totalSubtasks) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Attachments */}
          {todo.attachments && todo.attachments.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowAttachments(!showAttachments)}
                className="mb-2 flex items-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                <Paperclip className="mr-2 h-4 w-4" />
                <span>{todo.attachments.length} Attachment(s)</span>
              </button>
              {showAttachments && (
                <div className="ml-6 space-y-2">
                  {todo.attachments.map((attachment) => (
                    <div
                      key={attachment._id}
                      className="flex items-center justify-between rounded-md bg-gray-700 p-2"
                    >
                      <div className="flex min-w-0 flex-1 items-center space-x-2">
                        <span className="text-lg">
                          {getFileIcon(attachment.mimetype)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white">
                            {attachment.originalName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(attachment._id)}
                        className="text-red-400 transition-colors hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Links */}
          {todo.links && todo.links.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowLinks(!showLinks)}
                className="mb-2 flex items-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>{todo.links.length} Link(s)</span>
              </button>
              {showLinks && (
                <div className="ml-6 space-y-2">
                  {todo.links.map((link) => (
                    <div
                      key={link._id}
                      className="flex items-center justify-between rounded-md bg-gray-700 p-2"
                    >
                      <div className="min-w-0 flex-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-sm text-blue-400 transition-colors hover:text-blue-300"
                        >
                          {link.title || link.url}
                        </a>
                        {link.description && (
                          <p className="mt-1 text-xs text-gray-400">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveLink(link._id)}
                        className="ml-2 text-red-400 transition-colors hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Created {format(new Date(todo.createdAt), "MMM d, yyyy")}
            </span>
            {todo.updatedAt !== todo.createdAt && (
              <span>
                Updated {format(new Date(todo.updatedAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

TodoCard.propTypes = {
  todo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    description: PropTypes.string,
    isCompleted: PropTypes.bool.isRequired,
    priority: PropTypes.oneOf(["low", "medium", "high"]),
    dueDate: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
      })
    ),
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        originalName: PropTypes.string.isRequired,
        mimetype: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
      })
    ),
    links: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
  layout: PropTypes.oneOf(["grid", "list"]),
  onEdit: PropTypes.func.isRequired,
  onAddAttachment: PropTypes.func.isRequired,
  onAddLink: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func,
};

TodoCard.defaultProps = {
  layout: "grid",
  onViewDetails: null,
};

export default TodoCard;
