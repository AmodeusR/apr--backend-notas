import type { z } from "zod";

export function parseZodError(issue: z.core.$ZodIssue[]) {
  const error =  issue[0];
  const description = error.message;
  const field = String(error.path[0]);

  return { description, field };
}