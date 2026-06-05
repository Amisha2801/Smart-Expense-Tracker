import { Router } from "express";

import * as transactionController from "../controllers/transactionController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(transactionController.listTransactions));
router.post("/", asyncHandler(transactionController.createTransaction));
router.get("/:id", asyncHandler(transactionController.getTransaction));
router.patch("/:id", asyncHandler(transactionController.updateTransaction));
router.delete("/:id", asyncHandler(transactionController.deleteTransaction));

export default router;
