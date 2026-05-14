import { Router } from "express";
import { userRouter } from "./user.route";
import { studyGroupRouter } from "./study-group.route";
import { taskRouter } from "./task.routes";

const router = Router();

router.use("/users", userRouter);
router.use("/study-groups", studyGroupRouter);
router.use("/tasks", taskRouter);
export default router;
