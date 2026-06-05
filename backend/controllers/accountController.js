import * as accountService from "../services/accountService.js";

export async function listAccounts(req, res) {
  const accounts = await accountService.listAccounts(req.user.id);
  res.json({ data: accounts });
}

export async function getAccount(req, res) {
  const account = await accountService.getAccount(req.params.id, req.user.id);
  res.json({ data: account });
}

export async function createAccount(req, res) {
  const account = await accountService.createAccount(req.user.id, req.body);
  res.status(201).json({ data: account });
}

export async function updateAccount(req, res) {
  const account = await accountService.updateAccount(
    req.params.id,
    req.user.id,
    req.body
  );
  res.json({ data: account });
}

export async function deleteAccount(req, res) {
  const account = await accountService.deleteAccount(
    req.params.id,
    req.user.id
  );
  res.json({ data: account });
}

export async function listAccountTransactions(req, res) {
  const transactions = await accountService.listAccountTransactions(
    req.params.id,
    req.user.id
  );
  res.json({ data: transactions });
}
