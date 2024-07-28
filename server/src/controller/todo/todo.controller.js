import Todo from "../../model/todo/todo.model.js";
import asyncHandler from "../../util/asyncHandler.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { ApiError } from "../../util/ApiError.js";

export const createTodo = asyncHandler(async (req, res) => {
  const user = req.user;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Todo content is required");
  }

  const newTodo = await Todo.create({
    author: user._id,
    content,
  });

  if (!newTodo) {
    throw new ApiError(500, "Something went wrong while adding Todo");
  }

  const response = new ApiResponse(201, newTodo, "Todo added successfully");
  return res.status(response.statusCode).json(response);
});

export const getAllTodos = asyncHandler(async (req, res) => {
  const user = req.user;

  const todos = await Todo.find({ author: user._id })
    .select("-__v -author")
    .sort({ createdAt: 1 });

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
  }).select("-__v -author");

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const response = new ApiResponse(200, todo, "Todo fetched successfully");
  return res.status(response.statusCode).json(response);
});

export const editTodo = asyncHandler(async (req, res) => {
  const user = req.user;
  const { content } = req.body;
  const { todoId } = req.params;

  if (!content) {
    throw new ApiError(400, "Todo content is required");
  }

  const todo = await Todo.findOne({ _id: todoId, author: user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.content = content;

  const updatedTodo = await todo.save();

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

  const todo = await Todo.findOneAndDelete({ _id: todoId, author: user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

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

  const updatedTodo = await todo.save();

  const response = new ApiResponse(201, updatedTodo, "Todo status updated");
  return res.status(response.statusCode).json(response);
});
