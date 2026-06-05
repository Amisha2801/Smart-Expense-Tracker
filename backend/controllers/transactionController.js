import * as transactionService from "../services/transactionService.js";

export async function listTransactions(req, res) {
  const transactions = await transactionService.listTransactions(req.user.id);
  res.json({ data: transactions });
}

export async function getTransaction(req, res) {
  const transaction = await transactionService.getTransaction(
    req.params.id,
    req.user.id
  );
  res.json({ data: transaction });
}

export async function createTransaction(req, res) {
  const transaction = await transactionService.createTransaction(
    req.user.id,
    req.body
  );
  res.status(201).json({ data: transaction });
}

export async function updateTransaction(req, res) {
  const transaction = await transactionService.updateTransaction(
    req.params.id,
    req.user.id,
    req.body
  );
  res.json({ data: transaction });
}

export async function deleteTransaction(req, res) {
  const transaction = await transactionService.deleteTransaction(
    req.params.id,
    req.user.id
  );
  res.json({ data: transaction });
}
