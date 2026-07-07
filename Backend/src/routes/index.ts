import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import propertyRoutes from "../modules/properties/property.routes.js";
import propertyImageRoutes from "../modules/property-images/propertyImage.routes.js";
import userRoutes from "../modules/users/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/properties", propertyRoutes);

router.use("/properties", propertyImageRoutes);

router.use("/users", userRoutes);

export default router;