import { z } from "zod";

export const periodMonthSchema = z
  .string()
  .transform((val) => {
    if (/^\d{4}-\d{2}$/.test(val)) {
      return `${val}-01`;
    }
    return val;
  })
  .pipe(
    z
      .string()
      .regex(
        /^\d{4}-\d{2}-01$/,
        "period_month must be the first day of a month (YYYY-MM or YYYY-MM-01)"
      )
  );

export const listBudgetsQuerySchema = z.object({
  period_month: periodMonthSchema.optional(),
});

export const createBudgetSchema = z.object({
  category_id: z.coerce
    .number()
    .int("category_id must be an integer")
    .positive("category_id must be positive"),
  period_month: periodMonthSchema,
  allocated_cents: z.coerce
    .number()
    .int("allocated_cents must be an integer")
    .nonnegative("allocated_cents must be zero or greater")
    .optional()
    .default(0),
  rolls_over: z.boolean().optional().default(false),
  notes: z.string().trim().optional().nullable(),
});

export const updateBudgetSchema = z
  .object({
    category_id: z.coerce
      .number()
      .int("category_id must be an integer")
      .positive("category_id must be positive")
      .optional(),
    period_month: periodMonthSchema.optional(),
    allocated_cents: z.coerce
      .number()
      .int("allocated_cents must be an integer")
      .nonnegative("allocated_cents must be zero or greater")
      .optional(),
    rolls_over: z.boolean().optional(),
    notes: z.string().trim().nullable().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "No valid fields to update",
  });
