import { Router } from "express";
import { UserRole } from "@prisma/client";

import userController from "./user.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

router.use(authenticate);

router.use(authorize(UserRole.ADMIN));

router.get("/", userController.getAll);

router.post("/", userController.create);

router.put("/:id", userController.update);

router.patch("/:id/status", userController.changeStatus);

export default router;