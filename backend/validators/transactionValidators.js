import { AppError } from "../utils/AppError.js";
import * as accountRepository from "../repositories/accountRepository.js";
import * as categoryRepository from "../repositories/categoryRepository.js";
import * as transactionRepository from "../repositories/transactionRepository.js";

export async function getOwnedTransaction(id, userId) {
  const transaction = await transactionRepository.findById(Number(id));

  if (!transaction || transaction.user_id !== Number(userId)) {
    throw AppError.notFound("Transaction not found");
  }

  return transaction;
}

export async function validateAccountId(accountId, userId) {
  const account = await accountRepository.findById(Number(accountId));

  if (!account || account.user_id !== Number(userId) || account.is_archived) {
    throw AppError.badRequest("Invalid account");
  }
}

export async function validateCategoryId(categoryId, userId, type) {
  const category = await categoryRepository.findById(Number(categoryId));

  if (!category || category.user_id !== Number(userId) || category.is_archived) {
    throw AppError.badRequest("Invalid category");
  }

  if (category.kind !== type) {
    throw AppError.badRequest(
      `Category kind must match transaction type (${type})`
    );
  }
}


// aakriti: transaction validator instead of the rule constraint
export const validateTransaction = (data) => {
  const { type, category_id, transfer_group_id } = data;

  if (type === 'transfer') {
    console.log('Validating transfer transaction', { data });
    if (category_id) {
      throw new Error('Transfer transactions cannot have a category');
    }
    if (!transfer_group_id) {
      throw new Error('Transfer transactions must have a transfer_group_id');
    }
  }

  if (type === 'expense' || type === 'income') {
    if (!category_id) {
      throw new Error('Expense/income transactions must have a category');
    }
    if (transfer_group_id) {
      throw new Error('Expense/income transactions cannot have a transfer_group_id');
    }
  }
}

export function assertEditableType(transaction) {
  if (transaction.type === "transfer") {
    throw AppError.badRequest("Transfer transactions cannot be modified yet");
  }
}
