import type { UserRegistrationSchema } from "schemas/authSchemas";
import type z from "zod";

export type userRegistrationData = z.infer<typeof UserRegistrationSchema>;
