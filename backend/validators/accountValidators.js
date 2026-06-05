import { AppError } from "../utils/AppError.js";
import * as accountRepository from "../repositories/accountRepository.js";

export async function getOwnedAccount(id, userId) {
  const account = await accountRepository.findById(Number(id));

  if (!account || account.user_id !== Number(userId)) {
    throw AppError.notFound("Account not found");
  }

  return account;
}
