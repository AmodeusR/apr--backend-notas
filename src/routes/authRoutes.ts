import { db } from "@lib/prisma";
import type { UserLoginData, userRegistrationData } from "@typings/auth";
import type { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "generated/prisma/internal/prismaNamespace";
import jwt from "jsonwebtoken";
import { UserLoginSchema, UserRegistrationSchema } from "schemas/authSchemas";
import { parseZodIssues } from "utils/parseZodIssues";

export function authRoutes(fastify: FastifyInstance) {
	fastify.post<{ Body: UserLoginData }>("/login", async (req, reply) => {
		const userData = req.body;

		const { success, data, error } = UserLoginSchema.safeParse(userData);

		if (!success) {
			const { message } = parseZodIssues(error.issues);

			return reply.status(400).send({ message });
		}

		try {
			const user = await db.user.findUnique({
				where: {
					email: data.email,
				},
			});

			if (!user) return reply.status(404).send({ message: "User not found" });

			const isMatch = await Bun.password.verify(data.password, user.password);

			if (isMatch) {
				// biome-ignore lint: the environment variable exists
				const token = jwt.sign({ userId: user.id }, Bun.env.JWT_SECRET!, {
					expiresIn: "1h",
				});

				return reply.status(200).send({ token });
			}

			return reply.status(401).send({ message: "Wrong password provided" });
		} catch (error) {
			console.log(error);

			return reply.status(500).send({ error });
		}
	});

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
