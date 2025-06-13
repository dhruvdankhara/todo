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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/95 to-gray-900/95 shadow-2xl backdrop-blur-sm transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleToggleStatus}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-200",
                          currentTodo.isCompleted
                            ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25"
                            : "border-gray-600 hover:border-emerald-500 hover:bg-emerald-500/10"
                        )}
                      >
                        {currentTodo.isCompleted && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <Dialog.Title className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-lg font-semibold text-transparent">
                          Todo Details
                        </Dialog.Title>
                        <p className="text-sm text-gray-400">
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
                        className="rounded-2xl p-2 text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={onClose}
                        className="rounded-2xl p-2 text-gray-400 transition-all duration-200 hover:bg-gray-700/50 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>{" "}
                  {/* Content */}
                  <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
                    {/* Title */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
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
                            className="w-full rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "group cursor-pointer rounded-2xl border border-transparent p-4 transition-all duration-200 hover:border-gray-600/70 hover:bg-gray-700/50",
                            currentTodo.isCompleted && "opacity-60"
                          )}
                          onClick={() => setIsEditingTitle(true)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">
                              {currentTodo.content}
                            </span>
                            <Edit2 className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Priority & Due Date Row */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Priority */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Priority
                        </label>
                        {isEditingPriority ? (
                          <select
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value)}
                            onBlur={savePriority}
                            className="w-full rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
                              "w-full rounded-2xl border-2 px-4 py-3 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105",
                              currentTodo.priority === "low" &&
                                "border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400",
                              currentTodo.priority === "medium" &&
                                "border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400",
                              currentTodo.priority === "high" &&
                                "border-red-500/50 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400"
                            )}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <Flag className="h-4 w-4" />
                              <span>
                                {priorityConfig[currentTodo.priority]?.label}
                              </span>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Due Date
                        </label>
                        {isEditingDueDate ? (
                          <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            onBlur={saveDueDate}
                            className="w-full rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => setIsEditingDueDate(true)}
                            className="w-full rounded-2xl border border-gray-600/70 px-4 py-3 text-left text-gray-300 transition-all duration-200 hover:border-gray-500/70 hover:bg-gray-700/50"
                          >
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
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
                      <label className="mb-2 block text-sm font-medium text-gray-300">
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
                            className="w-full resize-none rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          className="group flex min-h-[80px] cursor-pointer items-center rounded-2xl border border-dashed border-gray-600/70 p-4 transition-all duration-200 hover:border-blue-500/70 hover:bg-blue-500/10"
                          onClick={() => setIsEditingDescription(true)}
                        >
                          {currentTodo.description ? (
                            <div className="flex w-full items-start justify-between">
                              <p className="whitespace-pre-wrap text-gray-300">
                                {currentTodo.description}
                              </p>
                              <Edit2 className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                          ) : (
                            <div className="flex w-full items-center justify-center text-gray-400">
                              <FileText className="mr-2 h-5 w-5" />
                              <span>Click to add description</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Subtasks */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-300">
                            Subtasks{" "}
                            {totalSubtasks > 0 &&
                              `(${completedSubtasks}/${totalSubtasks})`}
                          </h3>
                          {totalSubtasks > 0 && (
                            <div className="mt-2 h-2 w-full rounded-full bg-gray-700/70 shadow-inner">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setShowSubtaskInput(true)}
                          className="rounded-2xl p-2 text-blue-400 transition-all duration-200 hover:bg-blue-500/20"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>{" "}
                      {/* Add Subtask Input */}
                      {showSubtaskInput && (
                        <div className="mb-3 flex items-center space-x-2">
                          <input
                            type="text"
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            placeholder="Add a subtask..."
                            className="flex-1 rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleAddSubtask()
                            }
                            autoFocus
                          />
                          <button
                            onClick={handleAddSubtask}
                            disabled={!newSubtask.trim()}
                            className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setShowSubtaskInput(false);
                              setNewSubtask("");
                            }}
                            className="rounded-2xl p-3 text-gray-400 transition-all duration-200 hover:bg-gray-700/50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {/* Subtasks List */}
                      <div className="space-y-2">
                        {currentTodo.subtasks && currentTodo.subtasks.length > 0
                          ? currentTodo.subtasks.map((subtask) => (
                              <div
                                key={subtask._id}
                                className="group flex items-center space-x-3 rounded-2xl border border-gray-700/50 p-4 transition-all duration-200 hover:bg-gray-700/30"
                              >
                                <button
                                  onClick={() =>
                                    handleToggleSubtask(subtask._id)
                                  }
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200",
                                    subtask.isCompleted
                                      ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25"
                                      : "border-gray-600 hover:border-emerald-500"
                                  )}
                                >
                                  {subtask.isCompleted && (
                                    <Check className="h-3 w-3" />
                                  )}
                                </button>
                                <span
                                  className={cn(
                                    "flex-1 text-gray-300",
                                    subtask.isCompleted &&
                                      "text-gray-500 line-through"
                                  )}
                                >
                                  {subtask.content}
                                </span>
                                <button
                                  onClick={() =>
                                    handleDeleteSubtask(subtask._id)
                                  }
                                  className="p-1 text-gray-400 opacity-0 transition-all duration-200 hover:text-red-400 group-hover:opacity-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))
                          : !showSubtaskInput && (
                              <div
                                className="cursor-pointer rounded-2xl border border-dashed border-gray-600/70 p-6 text-center transition-all duration-200 hover:border-blue-500/70 hover:bg-blue-500/10"
                                onClick={() => setShowSubtaskInput(true)}
                              >
                                {" "}
                                <Plus className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                <p className="text-gray-400">
                                  Add your first subtask
                                </p>
                              </div>
                            )}
                      </div>
                    </div>
                    {/* Attachments Section */}{" "}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-300">
                          Attachments{" "}
                          {currentTodo.attachments &&
                            currentTodo.attachments.length > 0 &&
                            `(${currentTodo.attachments.length})`}
                        </h3>
                        <button
                          onClick={() => setShowAttachmentInput(true)}
                          className="rounded-2xl p-2 text-emerald-400 transition-all duration-200 hover:bg-emerald-500/20"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Add Attachment Input */}
                      {showAttachmentInput && (
                        <div className="mb-3 flex items-center space-x-2 rounded-2xl border border-dashed border-gray-600/70 p-4">
                          <input
                            type="file"
                            onChange={(e) =>
                              setNewAttachmentFile(e.target.files[0])
                            }
                            className="flex-1 text-sm text-gray-300 transition-all duration-200 file:mr-4 file:rounded-2xl file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-400 hover:file:bg-blue-500/30"
                          />
                          <button
                            onClick={handleAddAttachment}
                            disabled={!newAttachmentFile}
                            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-3 text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Upload className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setShowAttachmentInput(false);
                              setNewAttachmentFile(null);
                            }}
                            className="rounded-2xl p-3 text-gray-400 transition-all duration-200 hover:bg-gray-700/50"
                          >
                            <X className="h-4 w-4" />
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
                              className="group flex items-center space-x-3 rounded-2xl border border-gray-700/50 p-3 transition-all duration-200 hover:bg-gray-700/30"
                            >
                              {isImageFile(file) ? (
                                <img
                                  src={getImageUrl(file)}
                                  alt={file.filename}
                                  className="h-10 w-10 cursor-pointer rounded-xl object-cover shadow-sm"
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
                                <div className="flex h-8 w-8 items-center justify-center text-lg">
                                  {getFileIcon(file.filename)}
                                </div>
                              )}{" "}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-300">
                                  {file.filename}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                              <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                  onClick={() => downloadFile(file)}
                                  className="rounded-2xl p-2 text-gray-400 transition-all duration-200 hover:bg-blue-500/20 hover:text-blue-400"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveAttachment(file._id)
                                  }
                                  className="rounded-2xl p-2 text-gray-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !showAttachmentInput && (
                          <div
                            className="cursor-pointer rounded-2xl border border-dashed border-gray-600/70 p-6 text-center transition-all duration-200 hover:border-emerald-500/70 hover:bg-emerald-500/10"
                            onClick={() => setShowAttachmentInput(true)}
                          >
                            {" "}
                            <Paperclip className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                            <p className="text-gray-400">
                              Add your first attachment
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    {/* Links Section */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        {" "}
                        <h3 className="text-sm font-medium text-gray-300">
                          Links{" "}
                          {currentTodo.links &&
                            currentTodo.links.length > 0 &&
                            `(${currentTodo.links.length})`}
                        </h3>
                        <button
                          onClick={() => setShowLinkInput(true)}
                          className="rounded-2xl p-2 text-purple-400 transition-all duration-200 hover:bg-purple-500/20"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>{" "}
                      {/* Add Link Input */}
                      {showLinkInput && (
                        <div className="mb-4 space-y-3 rounded-2xl border border-dashed border-gray-600/70 p-4">
                          <input
                            type="url"
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                            placeholder="Enter URL..."
                            className="w-full rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            value={newLinkTitle}
                            onChange={(e) => setNewLinkTitle(e.target.value)}
                            placeholder="Link title (optional)..."
                            className="w-full rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            value={newLinkDescription}
                            onChange={(e) =>
                              setNewLinkDescription(e.target.value)
                            }
                            placeholder="Description (optional)..."
                            className="w-full rounded-2xl border border-gray-600/70 bg-gray-700/90 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleAddLink}
                              disabled={!newLinkUrl.trim()}
                              className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-3 text-white shadow-sm transition-all duration-200 hover:from-purple-700 hover:to-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setShowLinkInput(false);
                                setNewLinkUrl("");
                                setNewLinkTitle("");
                                setNewLinkDescription("");
                              }}
                              className="rounded-2xl p-3 text-gray-400 transition-all duration-200 hover:bg-gray-700/50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}{" "}
                      {/* Links List */}
                      {currentTodo.links && currentTodo.links.length > 0 ? (
                        <div className="space-y-2">
                          {currentTodo.links.map((link) => (
                            <div
                              key={link._id}
                              className="group flex items-center space-x-3 rounded-2xl border border-gray-700/50 p-4 transition-all duration-200 hover:bg-gray-700/30"
                            >
                              <LinkIcon className="h-5 w-5 flex-shrink-0 text-purple-400" />
                              <div className="min-w-0 flex-1">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block truncate text-sm font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
                                >
                                  {link.title || link.url}
                                </a>
                                {link.description && (
                                  <p className="truncate text-xs text-gray-500">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                  onClick={() =>
                                    window.open(link.url, "_blank")
                                  }
                                  className="rounded-2xl p-2 text-gray-400 transition-all duration-200 hover:bg-purple-500/20 hover:text-purple-400"
                                >
                                  <ExternalLink className="h-4 w-4" />{" "}
                                </button>
                                <button
                                  onClick={() => handleRemoveLink(link._id)}
                                  className="rounded-2xl p-2 text-gray-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        !showLinkInput && (
                          <div
                            className="cursor-pointer rounded-2xl border border-dashed border-gray-600/70 p-6 text-center transition-all duration-200 hover:border-purple-500/70 hover:bg-purple-500/10"
                            onClick={() => setShowLinkInput(true)}
                          >
                            <LinkIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                            <p className="text-gray-400">Add your first link</p>
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
                  {" "}
                  <Dialog.Panel className="relative w-full max-w-4xl">
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute right-4 top-4 z-10 rounded-2xl bg-gray-900/80 p-3 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-gray-800/90"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <img
                      src={getImageUrl(imagePreview)}
                      alt={imagePreview.filename}
                      className="h-auto max-h-[90vh] w-full rounded-3xl object-contain shadow-2xl"
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
