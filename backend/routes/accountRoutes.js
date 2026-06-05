import { Router } from "express";

import * as accountController from "../controllers/accountController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(accountController.listAccounts));
router.post("/", asyncHandler(accountController.createAccount));
router.get("/:id/transactions", asyncHandler(accountController.listAccountTransactions));
router.get("/:id", asyncHandler(accountController.getAccount));
router.patch("/:id", asyncHandler(accountController.updateAccount));
router.delete("/:id", asyncHandler(accountController.deleteAccount));

export default router;
