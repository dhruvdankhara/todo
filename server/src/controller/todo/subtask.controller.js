import SubTask from "../../model/todo/subtask.model.js";
import Todo from "../../model/todo/todo.model.js";
import asyncHandler from "../../util/asyncHandler.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { ApiError } from "../../util/ApiError.js";
import fs from "fs-extra";
import path from "path";

export const createSubTask = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Subtask content is required");
  }

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const newSubTask = await SubTask.create({
    parentTodo: todoId,
    content,
  });

  todo.subtasks.push(newSubTask._id);
  await todo.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(
    201,
    updatedTodo,
    "Subtask added successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Get all subtasks for a todo
export const getSubTasks = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtasks = await SubTask.find({ parentTodo: todoId })
    .select("-__v")
    .sort({ createdAt: 1 });

  const response = new ApiResponse(
    200,
    subtasks,
    "Subtasks fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Update subtask
export const updateSubTask = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, subtaskId } = req.params;
  const { content } = req.body;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtask = await SubTask.findOne({ _id: subtaskId, parentTodo: todoId });
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  if (content) {
    subtask.content = content;
  }

  const updatedSubTask = await subtask.save();

  const response = new ApiResponse(
    200,
    updatedSubTask,
    "Subtask updated successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Delete subtask
export const deleteSubTask = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, subtaskId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtask = await SubTask.findOneAndDelete({
    _id: subtaskId,
    parentTodo: todoId,
  });

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  todo.subtasks = todo.subtasks.filter((id) => id.toString() !== subtaskId);
  await todo.save();

  if (subtask.attachments && subtask.attachments.length > 0) {
    for (const attachment of subtask.attachments) {
      try {
        await fs.remove(attachment.path);
      } catch (error) {
        console.error(`Error deleting file: ${attachment.path}`, error);
      }
    }
  }

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(
    200,
    updatedTodo,
    "Subtask deleted successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Toggle subtask completion status
export const toggleSubTaskStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, subtaskId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtask = await SubTask.findOne({ _id: subtaskId, parentTodo: todoId });
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  subtask.isCompleted = !subtask.isCompleted;
  await subtask.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(
    200,
    updatedTodo,
    "Subtask status updated successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Add attachment to subtask
export const addSubTaskAttachment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, subtaskId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtask = await SubTask.findOne({ _id: subtaskId, parentTodo: todoId });
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const attachment = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype,
  };

  subtask.attachments.push(attachment);
  const updatedSubTask = await subtask.save();

  const response = new ApiResponse(
    200,
    updatedSubTask,
    "Attachment added successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Remove attachment from subtask
export const removeSubTaskAttachment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, subtaskId, attachmentId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtask = await SubTask.findOne({ _id: subtaskId, parentTodo: todoId });
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const attachment = subtask.attachments.id(attachmentId);
  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  try {
    await fs.remove(attachment.path);
  } catch (error) {
    console.error(`Error deleting file: ${attachment.path}`, error);
  }

  subtask.attachments.pull(attachmentId);
  const updatedSubTask = await subtask.save();

  const response = new ApiResponse(
    200,
    updatedSubTask,
    "Attachment removed successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Add link to subtask
export const addSubTaskLink = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, subtaskId } = req.params;
  const { title, url, description } = req.body;

  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtask = await SubTask.findOne({ _id: subtaskId, parentTodo: todoId });
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const link = {
    title: title || "",
    url,
    description: description || "",
  };

  subtask.links.push(link);
  const updatedSubTask = await subtask.save();

  const response = new ApiResponse(
    200,
    updatedSubTask,
    "Link added successfully"
  );
  return res.status(response.statusCode).json(response);
});

// Remove link from subtask
export const removeSubTaskLink = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, subtaskId, linkId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtask = await SubTask.findOne({ _id: subtaskId, parentTodo: todoId });
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const link = subtask.links.id(linkId);
  if (!link) {
    throw new ApiError(404, "Link not found");
  }

  subtask.links.pull(linkId);
  const updatedSubTask = await subtask.save();

  const response = new ApiResponse(
    200,
    updatedSubTask,
    "Link removed successfully"
  );
  return res.status(response.statusCode).json(response);
});
