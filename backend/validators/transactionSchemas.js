import { z } from "zod";

// added transfer to list of transaction types
const transactionTypeSchema = z.enum(["expense", "income", "transfer"], {
  error: "type must be one of: expense, income, transfer",
});

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "occurred_on must be YYYY-MM-DD");

export const createTransactionSchema = z.object({
  account_id: z.coerce
    .number()
    .int("account_id must be an integer")
    .positive("account_id must be positive"),
    // aakriti: added optional and nullable for transfer type transactions
  category_id: z.coerce
    .number()
    .int("category_id must be an integer")
    .positive("category_id must be positive")
    .optional()
    .nullable(),
  type: transactionTypeSchema,
  amount_cents: z.coerce
    .number()
    .int("amount_cents must be an integer")
    .positive("amount_cents must be greater than zero"),
  occurred_on: dateSchema,
  payee: z.string().trim().max(200).optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  is_cleared: z.boolean().optional().default(false),
});

export const updateTransactionSchema = z
  .object({
    account_id: z.coerce
      .number()
      .int("account_id must be an integer")
      .positive("account_id must be positive")
      .optional(),
    category_id: z.coerce
      .number()
      .int("category_id must be an integer")
      .positive("category_id must be positive")
      .optional(),
    type: transactionTypeSchema.optional(),
    amount_cents: z.coerce
      .number()
      .int("amount_cents must be an integer")
      .positive("amount_cents must be greater than zero")
      .optional(),
    occurred_on: dateSchema.optional(),
    payee: z.string().trim().max(200).nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    is_cleared: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "No valid fields to update",
  });
