import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  X,
  Check,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Flag,
  FileText,
  Link as LinkIcon,
  Paperclip,
  Download,
  ExternalLink,
  Save,
  Upload,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { format } from "date-fns";
import { cn, getFileIcon, formatFileSize } from "../utils/cn";
import {
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
  addSubtask,
  toggleSubtaskStatus,
  deleteSubtask,
  removeTodoAttachment,
  removeTodoLink,
  addTodoAttachment,
  addTodoLink,
} from "../store/todosSlice";

const ModernTodoDetailModal = ({ isOpen, onClose, todo }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);

  // Get the current todo from Redux state to ensure we have the latest data
  const currentTodo = todos.find((t) => t._id === todo?._id) || todo;

  // Editing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);

  // Form states
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  // Other states
  const [newSubtask, setNewSubtask] = useState("");
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // New states for attachments and links
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newAttachmentFile, setNewAttachmentFile] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");

  useEffect(() => {
    if (currentTodo) {
      setEditedTitle(currentTodo.content || "");
      setEditedDescription(currentTodo.description || "");
      setEditedPriority(currentTodo.priority || "medium");
      setEditedDueDate(
        currentTodo.dueDate
          ? new Date(currentTodo.dueDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [currentTodo]);

  if (!currentTodo) return null;

  // Auto-save functions with onBlur
  const saveTitle = async () => {
    if (editedTitle.trim() && editedTitle !== currentTodo.content) {
      await dispatch(
        updateTodo({
          id: currentTodo._id,
          data: { content: editedTitle.trim() },
        })
      );
    }
    setIsEditingTitle(false);
  };

  const saveDescription = async () => {
    if (editedDescription !== currentTodo.description) {
      await dispatch(
        updateTodo({
          id: currentTodo._id,
          data: { description: editedDescription.trim() },
        })
      );
    }
    setIsEditingDescription(false);
  };

  const savePriority = async () => {
    if (editedPriority !== currentTodo.priority) {
      await dispatch(
        updateTodo({
          id: currentTodo._id,
          data: { priority: editedPriority },
        })
      );
    }
    setIsEditingPriority(false);
  };

  const saveDueDate = async () => {
    const newDueDate = editedDueDate
      ? new Date(editedDueDate).toISOString()
      : null;
    const currentDueDate = currentTodo.dueDate
      ? new Date(currentTodo.dueDate).toISOString()
      : null;

    if (newDueDate !== currentDueDate) {
      await dispatch(
        updateTodo({
          id: currentTodo._id,
          data: { dueDate: newDueDate },
        })
      );
    }
    setIsEditingDueDate(false);
  };

  // Quick actions
  const handleToggleStatus = () => {
    dispatch(toggleTodoStatus(currentTodo._id));
  };

  const handleDeleteTodo = () => {
    if (window.confirm("Delete this todo?")) {
      dispatch(deleteTodo(currentTodo._id));
      onClose();
    }
  };

  const handleAddSubtask = async () => {
    if (newSubtask.trim()) {
      await dispatch(
        addSubtask({
          todoId: currentTodo._id,
          content: newSubtask.trim(),
        })
      );
      setNewSubtask("");
      setShowSubtaskInput(false);
    }
  };

  const handleToggleSubtask = (subtaskId) => {
    dispatch(toggleSubtaskStatus({ todoId: currentTodo._id, subtaskId }));
  };

  const handleDeleteSubtask = (subtaskId) => {
    dispatch(deleteSubtask({ todoId: currentTodo._id, subtaskId }));
  };

  const handleRemoveAttachment = (attachmentId) => {
    dispatch(removeTodoAttachment({ todoId: currentTodo._id, attachmentId }));
  };

  const handleRemoveLink = (linkId) => {
    dispatch(removeTodoLink({ todoId: currentTodo._id, linkId }));
  };

  const handleAddAttachment = async () => {
    if (newAttachmentFile) {
      const formData = new FormData();
      formData.append("attachment", newAttachmentFile);

      await dispatch(
        addTodoAttachment({
          id: currentTodo._id,
          formData: formData,
        })
      );

      setNewAttachmentFile(null);
      setShowAttachmentInput(false);
    }
  };

  // Link handling
  const handleAddLink = async () => {
    if (newLinkUrl.trim()) {
      await dispatch(
        addTodoLink({
          id: currentTodo._id,
          linkData: {
            url: newLinkUrl.trim(),
            title: newLinkTitle.trim() || newLinkUrl.trim(),
            description: newLinkDescription.trim(),
          },
        })
      );

      setNewLinkUrl("");
      setNewLinkTitle("");
      setNewLinkDescription("");
      setShowLinkInput(false);
    }
  };
  const isImageFile = (file) => {
    return (
      file.mimetype?.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.filename)
    );
  };

  const getImageUrl = (file) => {
    return `${
      import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
    }/todos/${currentTodo._id}/attachments/${file._id}`;
  };

  const downloadFile = (file) => {
    const url = getImageUrl(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedSubtasks =
    currentTodo.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalSubtasks = currentTodo.subtasks?.length || 0;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const priorityConfig = {
    low: { color: "emerald", label: "Low" },
    medium: { color: "amber", label: "Medium" },
    high: { color: "red", label: "High" },
  };

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleToggleStatus}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          currentTodo.isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-emerald-500"
                        )}
                      >
                        {currentTodo.isCompleted && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <div>
                        <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                          Todo Details
                        </Dialog.Title>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created{" "}
                          {currentTodo.createdAt
                            ? format(
                                new Date(currentTodo.createdAt),
                                "MMM d, yyyy"
                              )
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleDeleteTodo}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Title */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Title
                      </label>
                      {isEditingTitle ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={saveTitle}
                            onKeyPress={(e) => e.key === "Enter" && saveTitle()}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "p-3 rounded-lg border border-transparent cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group",
                            currentTodo.isCompleted && "opacity-60"
                          )}
                          onClick={() => setIsEditingTitle(true)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white font-medium">
                              {currentTodo.content}
                            </span>
                            <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Priority & Due Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Priority */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Priority
                        </label>
                        {isEditingPriority ? (
                          <select
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value)}
                            onBlur={savePriority}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => setIsEditingPriority(true)}
                            className={cn(
                              "w-full px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105",
                              currentTodo.priority === "low" &&
                                "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400",
                              currentTodo.priority === "medium" &&
                                "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:border-amber-600 dark:text-amber-400",
                              currentTodo.priority === "high" &&
                                "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400"
                            )}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <Flag className="w-4 h-4" />
                              <span>
                                {priorityConfig[currentTodo.priority]?.label}
                              </span>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Due Date
                        </label>
                        {isEditingDueDate ? (
                          <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            onBlur={saveDueDate}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => setIsEditingDueDate(true)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left"
                          >
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {currentTodo.dueDate
                                  ? format(
                                      new Date(currentTodo.dueDate),
                                      "MMM d, yyyy"
                                    )
                                  : "No due date"}
                              </span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Description
                      </label>
                      {isEditingDescription ? (
                        <div className="space-y-2">
                          <textarea
                            value={editedDescription}
                            onChange={(e) =>
                              setEditedDescription(e.target.value)
                            }
                            onBlur={saveDescription}
                            placeholder="Add a description..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          className="p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group min-h-[80px] flex items-center"
                          onClick={() => setIsEditingDescription(true)}
                        >
                          {currentTodo.description ? (
                            <div className="flex items-start justify-between w-full">
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {currentTodo.description}
                              </p>
                              <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full text-gray-500 dark:text-gray-400">
                              <FileText className="w-5 h-5 mr-2" />
                              <span>Click to add description</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Subtasks */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subtasks{" "}
                            {totalSubtasks > 0 &&
                              `(${completedSubtasks}/${totalSubtasks})`}
                          </h3>
                          {totalSubtasks > 0 && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setShowSubtaskInput(true)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Add Subtask Input */}
                      {showSubtaskInput && (
                        <div className="flex items-center space-x-2 mb-3">
                          <input
                            type="text"
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            placeholder="Add a subtask..."
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleAddSubtask()
                            }
                            autoFocus
                          />
                          <button
                            onClick={handleAddSubtask}
                            disabled={!newSubtask.trim()}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setShowSubtaskInput(false);
                              setNewSubtask("");
                            }}
                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Subtasks List */}
                      <div className="space-y-2">
                        {currentTodo.subtasks && currentTodo.subtasks.length > 0
                          ? currentTodo.subtasks.map((subtask) => (
                              <div
                                key={subtask._id}
                                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                              >
                                <button
                                  onClick={() =>
                                    handleToggleSubtask(subtask._id)
                                  }
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    subtask.isCompleted
                                      ? "bg-emerald-500 border-emerald-500 text-white"
                                      : "border-gray-300 dark:border-gray-600 hover:border-emerald-500"
                                  )}
                                >
                                  {subtask.isCompleted && (
                                    <Check className="w-3 h-3" />
                                  )}
                                </button>
                                <span
                                  className={cn(
                                    "flex-1 text-gray-700 dark:text-gray-300",
                                    subtask.isCompleted &&
                                      "line-through text-gray-500"
                                  )}
                                >
                                  {subtask.content}
                                </span>
                                <button
                                  onClick={() =>
                                    handleDeleteSubtask(subtask._id)
                                  }
                                  className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          : !showSubtaskInput && (
                              <div
                                className="p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                                onClick={() => setShowSubtaskInput(true)}
                              >
                                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">
                                  Add your first subtask
                                </p>
                              </div>
                            )}
                      </div>
                    </div>

                    {/* Attachments Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Attachments{" "}
                          {currentTodo.attachments &&
                            currentTodo.attachments.length > 0 &&
                            `(${currentTodo.attachments.length})`}
                        </h3>
                        <button
                          onClick={() => setShowAttachmentInput(true)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Add Attachment Input */}
                      {showAttachmentInput && (
                        <div className="flex items-center space-x-2 mb-3 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                          <input
                            type="file"
                            onChange={(e) =>
                              setNewAttachmentFile(e.target.files[0])
                            }
                            className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <button
                            onClick={handleAddAttachment}
                            disabled={!newAttachmentFile}
                            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setShowAttachmentInput(false);
                              setNewAttachmentFile(null);
                            }}
                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Attachments List */}
                      {currentTodo.attachments &&
                      currentTodo.attachments.length > 0 ? (
                        <div className="space-y-2">
                          {currentTodo.attachments.map((file) => (
                            <div
                              key={file._id}
                              className="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                            >
                              {isImageFile(file) ? (
                                <img
                                  src={getImageUrl(file)}
                                  alt={file.filename}
                                  className="w-8 h-8 object-cover rounded cursor-pointer"
                                  onClick={() => setImagePreview(file)}
                                  onError={(e) => {
                                    console.error("Failed to load image:", e);
                                    // Fallback: show file icon instead
                                    e.target.style.display = "none";
                                    e.target.nextElementSibling.style.display =
                                      "flex";
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 flex items-center justify-center text-lg">
                                  {getFileIcon(file.filename)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                  {file.filename}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => downloadFile(file)}
                                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveAttachment(file._id)
                                  }
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !showAttachmentInput && (
                          <div
                            className="p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all"
                            onClick={() => setShowAttachmentInput(true)}
                          >
                            <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">
                              Add your first attachment
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* Links Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Links{" "}
                          {currentTodo.links &&
                            currentTodo.links.length > 0 &&
                            `(${currentTodo.links.length})`}
                        </h3>
                        <button
                          onClick={() => setShowLinkInput(true)}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Add Link Input */}
                      {showLinkInput && (
                        <div className="space-y-2 mb-3 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                          <input
                            type="url"
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                            placeholder="Enter URL..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={newLinkTitle}
                            onChange={(e) => setNewLinkTitle(e.target.value)}
                            placeholder="Link title (optional)..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={newLinkDescription}
                            onChange={(e) =>
                              setNewLinkDescription(e.target.value)
                            }
                            placeholder="Description (optional)..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleAddLink}
                              disabled={!newLinkUrl.trim()}
                              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setShowLinkInput(false);
                                setNewLinkUrl("");
                                setNewLinkTitle("");
                                setNewLinkDescription("");
                              }}
                              className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Links List */}
                      {currentTodo.links && currentTodo.links.length > 0 ? (
                        <div className="space-y-2">
                          {currentTodo.links.map((link) => (
                            <div
                              key={link._id}
                              className="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                            >
                              <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate block"
                                >
                                  {link.title || link.url}
                                </a>
                                {link.description && (
                                  <p className="text-xs text-gray-500 truncate">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() =>
                                    window.open(link.url, "_blank")
                                  }
                                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveLink(link._id)}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !showLinkInput && (
                          <div
                            className="p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
                            onClick={() => setShowLinkInput(true)}
                          >
                            <LinkIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">
                              Add your first link
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Image Preview Modal */}
      {imagePreview && (
        <Transition appear show={!!imagePreview} as={React.Fragment}>
          <Dialog
            as="div"
            className="relative z-[60]"
            onClose={() => setImagePreview(null)}
          >
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/90" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="relative max-w-4xl w-full">
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <img
                      src={getImageUrl(imagePreview)}
                      alt={imagePreview.filename}
                      className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                      onError={(e) => {
                        console.error("Failed to load image:", e);
                      }}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

ModernTodoDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  todo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
    isCompleted: PropTypes.bool,
    createdAt: PropTypes.string,
    subtasks: PropTypes.array,
    attachments: PropTypes.array,
    links: PropTypes.array,
  }),
};

export default ModernTodoDetailModal;
