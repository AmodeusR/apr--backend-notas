import { z } from "zod";

export const NoteSchema = z.object({
	description: z.string(),
	due: z.date().optional(),
	expired: z.boolean().default(false),
	finished: z.boolean().default(false),
});
