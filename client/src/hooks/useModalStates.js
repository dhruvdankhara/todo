import { useState } from "react";

export const useModalStates = () => {
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);

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

  const handleAddSubtask = (todo) => {
    setSelectedTodo(todo);
    setShowTodoModal(true);
  };

  const handleAddAttachment = (todo) => {
    setSelectedTodo(todo);
    setShowFileModal(true);
  };

  const handleAddLink = (todo) => {
    setSelectedTodo(todo);
    setShowLinkModal(true);
  };

  const onCloseTodoModal = () => {
    setShowTodoModal(false);
    setEditingTodo(null);
  };

  const onCloseFileModal = () => {
    setShowFileModal(false);
    setSelectedTodo(null);
  };

  const onCloseLinkModal = () => {
    setShowLinkModal(false);
    setSelectedTodo(null);
  };

  const onCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTodo(null);
  };
  return {
    showTodoModal,
    showDetailModal,
    showFileModal,
    showLinkModal,
    editingTodo,
    selectedTodo,
    handleCreateTodo,
    handleEditTodo,
    handleViewDetails,
    handleAddSubtask,
    handleAddAttachment,
    handleAddLink,
    onCloseTodoModal,
    onCloseFileModal,
    onCloseLinkModal,
    onCloseDetailModal,
  };
};
