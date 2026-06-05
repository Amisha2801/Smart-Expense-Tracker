import { withTransaction } from "../db/withTransaction.js";
import { signedDelta } from "../utils/balanceUtils.js";
import { parseSchema } from "../utils/validate.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../validators/transactionSchemas.js";
import {
  assertEditableType,
  getOwnedTransaction,
  validateAccountId,
  validateTransaction,
  validateCategoryId,
} from "../validators/transactionValidators.js";
import * as accountRepository from "../repositories/accountRepository.js";
import * as transactionRepository from "../repositories/transactionRepository.js";

export async function listTransactions(userId) {
  return transactionRepository.findByUserId(Number(userId));
}

export async function getTransaction(id, userId) {
  return getOwnedTransaction(id, userId);
}

export async function createTransaction(userId, body) {
  const data = parseSchema(createTransactionSchema, body);

  validateTransaction(data)
  await validateAccountId(data.account_id, userId);
  await validateCategoryId(data.category_id, userId, data.type);

  return withTransaction(async (connection) => {
    const transaction = await transactionRepository.create(connection, {
      userId: Number(userId),
      accountId: data.account_id,
      categoryId: data.category_id,
      type: data.type,
      amountCents: data.amount_cents,
      occurredOn: data.occurred_on,
      payee: data.payee ?? null,
      notes: data.notes ?? null,
      isCleared: data.is_cleared,
    });

    await accountRepository.adjustBalance(
      connection,
      data.account_id,
      signedDelta(data.type, data.amount_cents)
    );

    return transaction;
  });
}

export async function updateTransaction(id, userId, body) {
  const existing = await getOwnedTransaction(id, userId);
  assertEditableType(existing);

  const fields = parseSchema(updateTransactionSchema, body);

  const type = fields.type ?? existing.type;
  const accountId = fields.account_id ?? existing.account_id;
  const categoryId = fields.category_id ?? existing.category_id;
  const amountCents = fields.amount_cents ?? existing.amount_cents;

  if (fields.account_id !== undefined) {
    await validateAccountId(accountId, userId);
  }

  if (fields.category_id !== undefined || fields.type !== undefined) {
    await validateCategoryId(categoryId, userId, type);
  }

  return withTransaction(async (connection) => {
    const oldSigned = signedDelta(existing.type, existing.amount_cents);
    const newSigned = signedDelta(type, amountCents);

    if (existing.account_id === accountId) {
      const delta = newSigned - oldSigned;
      if (delta !== 0) {
        await accountRepository.adjustBalance(connection, accountId, delta);
      }
    } else {
      await accountRepository.adjustBalance(
        connection,
        existing.account_id,
        -oldSigned
      );
      await accountRepository.adjustBalance(connection, accountId, newSigned);
    }

    return transactionRepository.update(connection, Number(id), fields);
  });
}

export async function deleteTransaction(id, userId) {
  const existing = await getOwnedTransaction(id, userId);
  assertEditableType(existing);

  return withTransaction(async (connection) => {
    await accountRepository.adjustBalance(
      connection,
      existing.account_id,
      -signedDelta(existing.type, existing.amount_cents)
    );

    await transactionRepository.remove(connection, Number(id));

    return existing;
  });
}
