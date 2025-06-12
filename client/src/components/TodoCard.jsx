import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Paperclip,
  Link as LinkIcon,
  MoreVertical,
  Edit3,
  Trash2,
  Plus,
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
  onEdit,
  onAddSubtask,
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

  return (
    <div
      className={cn(
        "group relative bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800/80",
        todo.isCompleted && "opacity-75"
      )}
    >
      {/* Priority Badge */}
      {todo.priority && (
        <div
          className={cn(
            "absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium border",
            priorityColors[todo.priority]
          )}
        >
          {todo.priority.toUpperCase()}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleToggleStatus}
            className="mt-1 text-gray-400 hover:text-blue-400 transition-colors"
          >
            {todo.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-lg font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors",
                todo.isCompleted && "line-through text-gray-400"
              )}
              onClick={handleViewDetails}
            >
              {todo.content}
            </h3>
            {todo.description && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {todo.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
            <MoreVertical className="w-4 h-4" />
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleEdit}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm w-full text-left",
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      )}
                    >
                      <Edit3 className="w-4 h-4 mr-3" />
                      Edit Todo
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onAddSubtask(todo)}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm w-full text-left",
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      )}
                    >
                      <Plus className="w-4 h-4 mr-3" />
                      Add Subtask
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onAddAttachment(todo)}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm w-full text-left",
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      )}
                    >
                      <Paperclip className="w-4 h-4 mr-3" />
                      Add Attachment
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onAddLink(todo)}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm w-full text-left",
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      )}
                    >
                      <LinkIcon className="w-4 h-4 mr-3" />
                      Add Link
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm w-full text-left",
                        active ? "bg-red-600 text-white" : "text-red-400"
                      )}
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Due Date */}
      {todo.dueDate && (
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due: {format(new Date(todo.dueDate), "PPP")}</span>
          {new Date(todo.dueDate) < new Date() && !todo.isCompleted && (
            <AlertCircle className="w-4 h-4 ml-2 text-red-400" />
          )}
        </div>
      )}

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Subtasks</span>
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <Paperclip className="w-4 h-4 mr-2" />
            <span>{todo.attachments.length} Attachment(s)</span>
          </button>
          {showAttachments && (
            <div className="space-y-2 ml-6">
              {todo.attachments.map((attachment) => (
                <div
                  key={attachment._id}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded-md"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="text-lg">
                      {getFileIcon(attachment.mimetype)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate">
                        {attachment.originalName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAttachment(attachment._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            <span>{todo.links.length} Link(s)</span>
          </button>
          {showLinks && (
            <div className="space-y-2 ml-6">
              {todo.links.map((link) => (
                <div
                  key={link._id}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded-md"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors truncate block"
                    >
                      {link.title || link.url}
                    </a>
                    {link.description && (
                      <p className="text-xs text-gray-400 mt-1">
                        {link.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveLink(link._id)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created {format(new Date(todo.createdAt), "MMM d, yyyy")}</span>
        {todo.updatedAt !== todo.createdAt && (
          <span>Updated {format(new Date(todo.updatedAt), "MMM d, yyyy")}</span>
        )}
      </div>
    </div>
  );
};

export default TodoCard;
