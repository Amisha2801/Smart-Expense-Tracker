import { z } from "zod";

const categoryKindSchema = z.enum(["expense", "income"], {
  error: "kind must be one of: expense, income",
});

const colorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "color must be a hex color like #FF5733");

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  kind: categoryKindSchema.optional().default("expense"),
  parent_id: z.coerce
    .number()
    .int("parent_id must be an integer")
    .positive("parent_id must be positive")
    .nullable()
    .optional()
    .default(null),
  icon: z.string().trim().min(1).max(50).optional().nullable(),
  color: colorSchema.optional().nullable(),
  sort_order: z.coerce
    .number()
    .int("sort_order must be an integer")
    .optional()
    .default(0),
});

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1, "name cannot be empty").optional(),
    kind: categoryKindSchema.optional(),
    parent_id: z.coerce
      .number()
      .int("parent_id must be an integer")
      .positive("parent_id must be positive")
      .nullable()
      .optional(),
    icon: z.string().trim().min(1).max(50).nullable().optional(),
    color: colorSchema.nullable().optional(),
    sort_order: z.coerce
      .number()
      .int("sort_order must be an integer")
      .optional(),
    is_archived: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "No valid fields to update",
  });
