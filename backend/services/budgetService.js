import { parseSchema } from "../utils/validate.js";
import {
  createBudgetSchema,
  listBudgetsQuerySchema,
  updateBudgetSchema,
} from "../validators/budgetSchemas.js";
import {
  ensureUniqueBudgetCategoryPeriod,
  getOwnedBudget,
  validateBudgetCategory,
} from "../validators/budgetValidators.js";
import * as budgetRepository from "../repositories/budgetRepository.js";

export async function listBudgets(userId, query = {}) {
  const { period_month: periodMonth } = parseSchema(
    listBudgetsQuerySchema,
    query
  );

  return budgetRepository.findByUserId(Number(userId), { periodMonth });
}

export async function getBudget(id, userId) {
  return getOwnedBudget(id, userId);
}

export async function createBudget(userId, body) {
  const data = parseSchema(createBudgetSchema, body);

  await validateBudgetCategory(data.category_id, userId);
  await ensureUniqueBudgetCategoryPeriod(data.category_id, data.period_month);

  return budgetRepository.create({
    userId: Number(userId),
    categoryId: data.category_id,
    periodMonth: data.period_month,
    allocatedCents: data.allocated_cents,
    rollsOver: data.rolls_over,
    notes: data.notes ?? null,
  });
}

export async function updateBudget(id, userId, body) {
  const existing = await getOwnedBudget(id, userId);
  const fields = parseSchema(updateBudgetSchema, body);

  const categoryId = fields.category_id ?? existing.category_id;
  const periodMonth = fields.period_month ?? existing.period_month;

  if (fields.category_id !== undefined) {
    await validateBudgetCategory(fields.category_id, userId);
  }

  if (fields.category_id !== undefined || fields.period_month !== undefined) {
    await ensureUniqueBudgetCategoryPeriod(categoryId, periodMonth, id);
  }

  return budgetRepository.update(Number(id), fields);
}

export async function deleteBudget(id, userId) {
  await getOwnedBudget(id, userId);

  return budgetRepository.remove(Number(id));
}
