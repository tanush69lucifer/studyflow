import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "../controllers/taskController.js";

const router = Router();
router.use(protect); // every task route needs a valid JWT

router.route("/").get(listTasks).post(createTask);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

export default router;
