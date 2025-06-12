import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import {
  createTodo,
  deleteTodo,
  editTodo,
  getAllTodos,
  getTodoById,
  markTodoStatus,
  addTodoAttachment,
  removeTodoAttachment,
  addTodoLink,
  removeTodoLink,
  getTodoStats,
  getAttachment,
} from "../../controller/todo/todo.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createTodo).get(getAllTodos);

router.route("/stats").get(getTodoStats);

router.route("/:todoId").get(getTodoById).put(editTodo).delete(deleteTodo);

router.route("/:todoId/status").patch(markTodoStatus);

router
  .route("/:todoId/attachments")
  .post(upload.single("attachment"), addTodoAttachment);

router
  .route("/:todoId/attachments/:attachmentId")
  .delete(removeTodoAttachment)
  .get(getAttachment);

router.route("/:todoId/links").post(addTodoLink);

router.route("/:todoId/links/:linkId").delete(removeTodoLink);

export default router;
