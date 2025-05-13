import z from "zod";

const minimumPasswordChars = 8;
const userMessages = {
  username: {
    minChars: "Username needs to have at least 3 characters",
    maxChars: "Username needs to have a maximum of 10 characters",
  },
  password: {
    minChars: `Username needs to have at least ${minimumPasswordChars} characters`,
    uppercase: "The password must have at least 1 uppercase letter",
    number: "The password must have at least 1 number",
    symbol: "The password must have at least 1 symbol",
  },
};

export const UserRegistrationSchema = z.interface({
  username: z
    .string()
    .min(3, userMessages.username.minChars)
    .max(10, userMessages.username.maxChars),
  email: z.email(),
  password: z
    .string()
    .min(minimumPasswordChars, userMessages.password.minChars)
    .refine((val) => /[A-Z]/.test(val), userMessages.password.uppercase)
    .refine((val) => /\d/.test(val), userMessages.password.number)
    .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), userMessages.password.symbol)
});
