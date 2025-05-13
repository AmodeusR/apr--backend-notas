import type z from "zod";
import { UserRegistrationSchema } from "schemas/authSchemas";

export type userRegistrationData = z.infer<typeof UserRegistrationSchema>;