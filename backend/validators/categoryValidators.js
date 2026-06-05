import { AppError } from "../utils/AppError.js";
import * as categoryRepository from "../repositories/categoryRepository.js";

export async function getOwnedCategory(id, userId) {
  const category = await categoryRepository.findById(Number(id));

  if (!category || category.user_id !== Number(userId)) {
    throw AppError.notFound("Category not found");
  }

  return category;
}

export async function validateParentId(parentId, userId, categoryId = null) {
  if (parentId === null || parentId === undefined) {
    return;
  }

  const parentIdNum = Number(parentId);

  if (categoryId !== null && parentIdNum === Number(categoryId)) {
    throw AppError.badRequest("Category cannot be its own parent");
  }

  const parent = await categoryRepository.findById(parentIdNum);

  if (!parent || parent.user_id !== Number(userId) || parent.is_archived) {
    throw AppError.badRequest("Invalid parent category");
  }
}
