import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import {
  createSubTask,
  getSubTasks,
  updateSubTask,
  deleteSubTask,
  toggleSubTaskStatus,
  addSubTaskAttachment,
  removeSubTaskAttachment,
  addSubTaskLink,
  removeSubTaskLink,
} from "../../controller/todo/subtask.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/:todoId/subtasks").post(createSubTask).get(getSubTasks);

router
  .route("/:todoId/subtasks/:subtaskId")
  .put(updateSubTask)
  .delete(deleteSubTask);

router.route("/:todoId/subtasks/:subtaskId/status").patch(toggleSubTaskStatus);

router
  .route("/:todoId/subtasks/:subtaskId/attachments")
  .post(upload.single("attachment"), addSubTaskAttachment);

router
  .route("/:todoId/subtasks/:subtaskId/attachments/:attachmentId")
  .delete(removeSubTaskAttachment);

router.route("/:todoId/subtasks/:subtaskId/links").post(addSubTaskLink);

router
  .route("/:todoId/subtasks/:subtaskId/links/:linkId")
  .delete(removeSubTaskLink);

export default router;
