import { Router } from "express";
import { UserRole } from "@prisma/client";

import propertyController from "./property.controller.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

router.get("/", propertyController.getAll);

router.get("/:id", propertyController.getById);

router.post(
    "/",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SELLER),
    propertyController.create
);

router.put(
    "/:id",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SELLER),
    propertyController.update
);

router.delete(
    "/:id",
    authenticate,
    authorize(UserRole.ADMIN),
    propertyController.delete
);

export default router;