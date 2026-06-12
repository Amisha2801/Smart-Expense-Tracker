import { AppError } from "../utils/AppError.js";
import * as budgetRepository from "../repositories/budgetRepository.js";
import * as categoryRepository from "../repositories/categoryRepository.js";

export async function getOwnedBudget(id, userId) {
  const budget = await budgetRepository.findById(Number(id));

  if (!budget || budget.user_id !== Number(userId)) {
    throw AppError.notFound("Budget not found");
  }

  return budget;
}

export async function validateBudgetCategory(categoryId, userId) {
  const category = await categoryRepository.findById(Number(categoryId));

  if (!category || category.user_id !== Number(userId) || category.is_archived) {
    throw AppError.badRequest("Invalid category");
  }

  if (category.kind !== "expense") {
    throw AppError.badRequest("Budgets can only be assigned to expense categories");
  }

  return category;
}

export async function ensureUniqueBudgetCategoryPeriod(
  categoryId,
  periodMonth,
  excludeBudgetId = null
) {
  const existing = await budgetRepository.findByCategoryAndPeriod(
    Number(categoryId),
    periodMonth
  );

  if (existing && existing.id !== Number(excludeBudgetId)) {
    throw AppError.badRequest(
      "A budget already exists for this category and month"
    );
  }
}
