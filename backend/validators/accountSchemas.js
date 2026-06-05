import { z } from "zod";

const accountTypeSchema = z.enum(
  ["checking", "savings", "credit_card", "cash", "investment"],
  { error: "type must be one of: checking, savings, credit_card, cash, investment" }
);

const currencySchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "currency must be a 3-letter ISO code");

export const createAccountSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  type: accountTypeSchema,
  starting_balance_cents: z.coerce
    .number()
    .int("starting_balance_cents must be an integer")
    .optional()
    .default(0),
  currency: currencySchema.optional().default("USD"),
});

export const updateAccountSchema = z
  .object({
    name: z.string().trim().min(1, "name cannot be empty").optional(),
    type: accountTypeSchema.optional(),
    starting_balance_cents: z.coerce
      .number()
      .int("starting_balance_cents must be an integer")
      .optional(),
    currency: currencySchema.optional(),
    is_archived: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "No valid fields to update",
  });
