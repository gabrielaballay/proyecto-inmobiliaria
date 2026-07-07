import { Router } from "express";
import { UserRole } from "@prisma/client";

import upload from "../../config/multer.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

import propertyImageController from "./propertyImage.controller.js";

const router = Router();

router.post(
    "/:id/images",
    authenticate,
    authorize(
        UserRole.ADMIN,
        UserRole.SELLER
    ),

    upload.array("images", 20),

    propertyImageController.upload
);

router.delete(
    "/images/:id",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SELLER),
    propertyImageController.delete
);

router.patch(
    "/images/:id/primary",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SELLER),
    propertyImageController.setPrimary
);

router.patch(
    "/images/reorder",
    authenticate,
    authorize(UserRole.ADMIN, UserRole.SELLER),
    propertyImageController.reorder
);

export default router;