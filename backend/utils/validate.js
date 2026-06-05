import { AppError } from "./AppError.js";

export function parseSchema(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    throw AppError.badRequest(message);
  }

  return result.data;
}
