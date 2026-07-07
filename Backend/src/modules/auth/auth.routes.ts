import { Router } from "express";
import authController from "./auth.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

router.post("/login", authController.login);

router.get("/me", authenticate, authController.me);

router.put("/me", authenticate, authController.updateMe);

router.patch("/me/password", authenticate, authController.changePassword);

export default router;