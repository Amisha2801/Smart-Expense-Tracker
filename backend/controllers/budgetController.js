import * as budgetService from "../services/budgetService.js";

export async function listBudgets(req, res) {
  const budgets = await budgetService.listBudgets(req.user.id, req.query);
  res.json({ data: budgets });
}

export async function getBudget(req, res) {
  const budget = await budgetService.getBudget(req.params.id, req.user.id);
  res.json({ data: budget });
}

export async function createBudget(req, res) {
  const budget = await budgetService.createBudget(req.user.id, req.body);
  res.status(201).json({ data: budget });
}

export async function updateBudget(req, res) {
  const budget = await budgetService.updateBudget(
    req.params.id,
    req.user.id,
    req.body
  );
  res.json({ data: budget });
}

export async function deleteBudget(req, res) {
  const budget = await budgetService.deleteBudget(req.params.id, req.user.id);
  res.json({ data: budget });
}
