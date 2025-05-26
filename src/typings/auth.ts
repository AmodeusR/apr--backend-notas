import type { UserRegistrationSchema } from "schemas/authSchemas";
import type { UserLoginSchema, UserRegistrationSchema } from "schemas/authSchemas";
import type z from "zod";

export type userRegistrationData = z.infer<typeof UserRegistrationSchema>;
export type UserLoginData = z.infer<typeof UserLoginSchema>;
