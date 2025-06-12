import Todo from "../../model/todo/todo.model.js";
import SubTask from "../../model/todo/subtask.model.js";
import asyncHandler from "../../util/asyncHandler.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { ApiError } from "../../util/ApiError.js";
import fs from "fs-extra";

export const createTodo = asyncHandler(async (req, res) => {
  const user = req.user;
  const { content, description, priority, dueDate } = req.body;

  if (!content) {
    throw new ApiError(400, "Todo content is required");
  }

  const todoData = {
    author: user._id,
    content,
  };

  if (description) todoData.description = description;
  if (priority) todoData.priority = priority;
  if (dueDate) todoData.dueDate = new Date(dueDate);

  const newTodo = await Todo.create(todoData);

  if (!newTodo) {
    throw new ApiError(500, "Something went wrong while adding Todo");
  }

  const response = new ApiResponse(201, newTodo, "Todo added successfully");
  return res.status(response.statusCode).json(response);
});

export const getAllTodos = asyncHandler(async (req, res) => {
  const user = req.user;

  const todos = await Todo.find({ author: user._id })
    .populate("subtasks")
    .select("-__v -author")
    .sort({ createdAt: -1 });

  if (!todos) {
    throw new ApiError(404, "No Todos found");
  }

  const response = new ApiResponse(200, todos, "Todos fetched successfully");
  return res.status(response.statusCode).json(response);
});

export const getTodoById = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId } = req.params;

  const todo = await Todo.findOne({
    _id: todoId,
    author: user._id,
  })
    .populate("subtasks")
    .select("-__v -author");

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const response = new ApiResponse(200, todo, "Todo fetched successfully");
  return res.status(response.statusCode).json(response);
});

export const editTodo = asyncHandler(async (req, res) => {
  const user = req.user;
  const { content, description, priority, dueDate } = req.body;
  const { todoId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  if (content !== undefined) {
    if (!content.trim()) {
      throw new ApiError(400, "Todo content cannot be empty");
    }
    todo.content = content;
  }
  if (description !== undefined) todo.description = description;
  if (priority) todo.priority = priority;
  if (dueDate) todo.dueDate = new Date(dueDate);

  await todo.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(
    200,
    updatedTodo,
    "Todo updated successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const subtasks = await SubTask.find({ parentTodo: todoId });

  for (const subtask of subtasks) {
    if (subtask.attachments && subtask.attachments.length > 0) {
      for (const attachment of subtask.attachments) {
        try {
          await fs.remove(attachment.path);
        } catch (error) {
          console.error(`Error deleting file: ${attachment.path}`, error);
        }
      }
    }
  }

  if (todo.attachments && todo.attachments.length > 0) {
    for (const attachment of todo.attachments) {
      try {
        await fs.remove(attachment.path);
      } catch (error) {
        console.error(`Error deleting file: ${attachment.path}`, error);
      }
    }
  }

  await SubTask.deleteMany({ parentTodo: todoId });

  await Todo.findByIdAndDelete(todoId);

  const response = new ApiResponse(200, todo, "Todo deleted successfully");
  return res.status(response.statusCode).json(response);
});

export const markTodoStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId } = req.params;

  const todo = await Todo.findOne({
    _id: todoId,
    author: user._id,
  }).select("-__v -author");

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }
  if (todo.isCompleted) {
    todo.isCompleted = false;
  } else {
    todo.isCompleted = true;
  }

  await todo.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(201, updatedTodo, "Todo status updated");
  return res.status(response.statusCode).json(response);
});

export const addTodoAttachment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const attachment = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype,
  };
  todo.attachments.push(attachment);
  await todo.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(
    200,
    updatedTodo,
    "Attachment added successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const removeTodoAttachment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, attachmentId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const attachment = todo.attachments.id(attachmentId);
  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  try {
    await fs.remove(attachment.path);
  } catch (error) {
    console.error(`Error deleting file: ${attachment.path}`, error);
  }

  todo.attachments.pull(attachmentId);
  await todo.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(
    200,
    updatedTodo,
    "Attachment removed successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const addTodoLink = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId } = req.params;
  const { title, url, description } = req.body;

  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const link = {
    title: title || "",
    url,
    description: description || "",
  };
  todo.links.push(link);
  await todo.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(200, updatedTodo, "Link added successfully");
  return res.status(response.statusCode).json(response);
});

export const removeTodoLink = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, linkId } = req.params;

  const todo = await Todo.findOne({ _id: todoId, author: user._id });
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const link = todo.links.id(linkId);
  if (!link) {
    throw new ApiError(404, "Link not found");
  }
  todo.links.pull(linkId);
  await todo.save();

  const updatedTodo = await Todo.findById(todoId).populate("subtasks");

  const response = new ApiResponse(
    200,
    updatedTodo,
    "Link removed successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const getTodoStats = asyncHandler(async (req, res) => {
  const user = req.user;

  const totalTodos = await Todo.countDocuments({ author: user._id });
  const completedTodos = await Todo.countDocuments({
    author: user._id,
    isCompleted: true,
  });
  const pendingTodos = totalTodos - completedTodos;

  const totalSubtasks = await SubTask.countDocuments({
    parentTodo: { $in: await Todo.find({ author: user._id }).distinct("_id") },
  });
  const completedSubtasks = await SubTask.countDocuments({
    parentTodo: { $in: await Todo.find({ author: user._id }).distinct("_id") },
    isCompleted: true,
  });

  const stats = {
    todos: {
      total: totalTodos,
      completed: completedTodos,
      pending: pendingTodos,
      completionRate:
        totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
    },
    subtasks: {
      total: totalSubtasks,
      completed: completedSubtasks,
      pending: totalSubtasks - completedSubtasks,
      completionRate:
        totalSubtasks > 0
          ? Math.round((completedSubtasks / totalSubtasks) * 100)
          : 0,
    },
  };

  const response = new ApiResponse(
    200,
    stats,
    "Statistics fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const getAttachment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { todoId, attachmentId } = req.params;

  const todo = await Todo.findOne({
    _id: todoId,
    author: user._id,
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const attachment = todo.attachments.find(
    (att) => att._id.toString() === attachmentId
  );

  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  const filePath = `public/uploads/${attachment.filename}`;

  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, "File not found on server");
  }

  res.setHeader(
    "Content-Type",
    attachment.mimetype || "application/octet-stream"
  );
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${attachment.originalName}"`
  );

  return res.sendFile(filePath, { root: process.cwd() });
});
