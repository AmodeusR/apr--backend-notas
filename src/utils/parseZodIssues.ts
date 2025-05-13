import type { z } from "zod";

export function parseZodIssues(issue: z.core.$ZodIssue[]) {
	const error = issue[0];
	const description = error.message;
	const field = String(error.path[0]);
	const message = `error on field ${field}: ${description}`;
	return { description, field, message };
}
