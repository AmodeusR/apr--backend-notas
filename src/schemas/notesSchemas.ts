import { z } from "zod";

export const NoteSchema = z.interface({
  description: z.string(),
  due: z.date().optional(),
  expired: z.boolean()
})
