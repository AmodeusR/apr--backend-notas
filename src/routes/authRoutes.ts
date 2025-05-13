import { db } from "@lib/prisma";
import type { userRegistrationData } from "@typings/auth";
import type { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "generated/prisma/internal/prismaNamespace";
import { UserRegistrationSchema } from "schemas/authSchemas";
import { parseZodIssues } from "utils/parseZodIssues";

export function authRoutes(fastify: FastifyInstance) {
	fastify.post<{ Body: userRegistrationData }>(
		"/register",
		async (req, reply) => {
			const userData = req.body;

			const { success, data, error } =
				UserRegistrationSchema.safeParse(userData);

			if (!success) {
				const { message } = parseZodIssues(error.issues);

				return reply.status(400).send({ message });
			}

			try {
				const userToRegister = {
					username: data.username,
					email: data.email,
					password: await Bun.password.hash(data.password),
				};

				const newUser = await db.user.create({ data: userToRegister });
				return reply.status(201).send({ newUser });
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError)
					if (error.code === "P2002") {
						return reply
							.status(409)
							.send({ message: "This email is already registered" });
					}
			}

			return reply.status(500).send();
		},
	);
}
