import { Router } from "express";

import * as userController from "../controllers/userController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/register", asyncHandler(userController.register));
router.post("/login", asyncHandler(userController.login));
router.get("/me", authenticate, asyncHandler(userController.getMe));

export default router;
