import { parseSchema } from "../utils/validate.js";
import {
  createAccountSchema,
  updateAccountSchema,
} from "../validators/accountSchemas.js";
import { getOwnedAccount } from "../validators/accountValidators.js";
import * as accountRepository from "../repositories/accountRepository.js";
import * as transactionRepository from "../repositories/transactionRepository.js";

export async function listAccounts(userId) {
  return accountRepository.findByUserId(Number(userId));
}

export async function getAccount(id, userId) {
  return getOwnedAccount(id, userId);
}

export async function createAccount(userId, body) {
  const data = parseSchema(createAccountSchema, body);

  return accountRepository.create({
    userId: Number(userId),
    name: data.name,
    type: data.type,
    startingBalanceCents: data.starting_balance_cents,
    currency: data.currency,
  });
}

export async function updateAccount(id, userId, body) {
  const existing = await getOwnedAccount(id, userId);

  const fields = parseSchema(updateAccountSchema, body);

  if (fields.starting_balance_cents !== undefined) {
    const delta = fields.starting_balance_cents - existing.starting_balance_cents;
    fields.current_balance_cents =
      existing.current_balance_cents + delta;
  }

  return accountRepository.update(Number(id), fields);
}

export async function deleteAccount(id, userId) {
  await getOwnedAccount(id, userId);

  return accountRepository.update(Number(id), { is_archived: true });
}

export async function listAccountTransactions(accountId, userId) {
  await getOwnedAccount(accountId, userId);

  return transactionRepository.findByAccountIdWithRunningBalance(
    Number(accountId),
    Number(userId)
  );
}
