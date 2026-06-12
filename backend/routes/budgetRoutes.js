import { Router } from "express";

import * as budgetController from "../controllers/budgetController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(budgetController.listBudgets));
router.post("/", asyncHandler(budgetController.createBudget));
router.get("/:id", asyncHandler(budgetController.getBudget));
router.patch("/:id", asyncHandler(budgetController.updateBudget));
router.delete("/:id", asyncHandler(budgetController.deleteBudget));

export default router;
