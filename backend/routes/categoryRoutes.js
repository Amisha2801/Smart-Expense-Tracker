import { Router } from "express";

import * as categoryController from "../controllers/categoryController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(categoryController.listCategories));
router.post("/", asyncHandler(categoryController.createCategory));
router.get("/:id", asyncHandler(categoryController.getCategory));
router.patch("/:id", asyncHandler(categoryController.updateCategory));
router.delete("/:id", asyncHandler(categoryController.deleteCategory));

export default router;
