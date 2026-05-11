import { Router } from "express";
import { userRouter } from "./user.route";
import { studyGroupRouter } from "./study-group.route";

const router = Router();

router.use("/users", userRouter);
router.use("/study-groups", studyGroupRouter);
export default router;
