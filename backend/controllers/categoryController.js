import * as categoryService from "../services/categoryService.js";

export async function listCategories(req, res) {
  const categories = await categoryService.listCategories(req.user.id);
  res.json({ data: categories });
}

export async function getCategory(req, res) {
  const category = await categoryService.getCategory(req.params.id, req.user.id);
  res.json({ data: category });
}

export async function createCategory(req, res) {
  const category = await categoryService.createCategory(req.user.id, req.body);
  res.status(201).json({ data: category });
}

export async function updateCategory(req, res) {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.user.id,
    req.body
  );
  res.json({ data: category });
}

export async function deleteCategory(req, res) {
  const category = await categoryService.deleteCategory(
    req.params.id,
    req.user.id
  );
  res.json({ data: category });
}
