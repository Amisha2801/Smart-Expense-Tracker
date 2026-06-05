import { parseSchema } from "../utils/validate.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categorySchemas.js";
import {
  getOwnedCategory,
  validateParentId,
} from "../validators/categoryValidators.js";
import * as categoryRepository from "../repositories/categoryRepository.js";

export async function listCategories(userId) {
  return categoryRepository.findByUserId(Number(userId));
}

export async function getCategory(id, userId) {
  return getOwnedCategory(id, userId);
}

export async function createCategory(userId, body) {
  const data = parseSchema(createCategorySchema, body);

  await validateParentId(data.parent_id, userId);

  return categoryRepository.create({
    userId: Number(userId),
    name: data.name,
    kind: data.kind,
    parentId: data.parent_id,
    icon: data.icon ?? null,
    color: data.color ?? null,
    sortOrder: data.sort_order,
  });
}

export async function updateCategory(id, userId, body) {
  await getOwnedCategory(id, userId);

  const fields = parseSchema(updateCategorySchema, body);

  if (fields.parent_id !== undefined) {
    await validateParentId(fields.parent_id, userId, id);
  }

  return categoryRepository.update(Number(id), fields);
}

export async function deleteCategory(id, userId) {
  await getOwnedCategory(id, userId);

  return categoryRepository.update(Number(id), { is_archived: true });
}
