import { Router } from "express";

import {
  createTodo,
  deleteTodo,
  editTodo,
  getAllTodos,
  getTodoById,
  markTodoStatus,
} from "../controller/todo.controller.js";

const router = Router();

router.route("/").post(createTodo).get(getAllTodos);

router.route("/:todoId").get(getTodoById).post(editTodo).delete(deleteTodo);

router.route("/status/:todoId").post(markTodoStatus);

export default router;
