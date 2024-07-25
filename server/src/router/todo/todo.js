import { Router } from "express";

import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  createTodo,
  deleteTodo,
  editTodo,
  getAllTodos,
  getTodoById,
  markTodoStatus,
} from "../../controller/todo/todo.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createTodo).get(getAllTodos);

router.route("/:todoId").get(getTodoById).post(editTodo).delete(deleteTodo);

router.route("/status/:todoId").post(markTodoStatus);

export default router;
