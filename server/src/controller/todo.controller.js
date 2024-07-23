import Todo from "../model/todo.model.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { ApiError, handleApiError } from "../util/errorHandler.js";

const createTodo = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      throw new ApiError(400, "Todo content is required");
    }

    const newTodo = await Todo.create({
      content,
    });

    if (!newTodo) {
      throw new ApiError(500, "Something went wrong while adding Todo");
    }

    const response = new ApiResponse(201, newTodo, "Todo added successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return handleApiError(error, res);
  }
};

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().select("-__v ").sort({ createdAt: 1 });

    if (!todos) {
      throw new ApiError(404, "No Todos found");
    }

    const response = new ApiResponse(200, todos, "Todos fetched successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return handleApiError(error, res);
  }
};

const getTodoById = async (req, res) => {
  try {
    // const user = req.user;
    const { todoId } = req.params;

    const todo = await Todo.findOne({
      _id: todoId,
    }).select("-__v ");

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    const response = new ApiResponse(200, todo, "Todo fetched successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return handleApiError(error, res);
  }
};

const editTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    // const user = req.user;
    const { content } = req.body;

    if (!content) {
      throw new ApiError(400, "Todo content is required");
    }

    const todo = await Todo.findOne({ _id: todoId });

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
  } catch (error) {
    return handleApiError(error, res);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    // const user = req.user;

    const todo = await Todo.findOneAndDelete({ _id: todoId });

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    const response = new ApiResponse(200, todo, "Todo deleted successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return handleApiError(error, res);
  }
};

const markTodoStatus = async (req, res) => {
  try {
    const { todoId } = req.params;
    // const user = req.user;

    const todo = await Todo.findOne({
      _id: todoId,
    }).select("-__v ");

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
  } catch (error) {
    return handleApiError(error, res);
  }
};

export {
  createTodo,
  getAllTodos,
  getTodoById,
  editTodo,
  deleteTodo,
  markTodoStatus,
};
