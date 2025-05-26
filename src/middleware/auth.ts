import type { JwtPayload } from "@typings/auth";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function validateJWT(req: FastifyRequest, reply: FastifyReply) {
	const authHeader = req.headers.authorization;

	if (!authHeader)
		return reply
			.status(401)
			.send({ message: " Unauthorized (no token found)" });

	const token = authHeader.replace("Bearer ", "");
	
	try {
		// biome-ignore lint: the environment variable exists
		const decoded = jwt.verify(token, Bun.env.JWT_SECRET!) as JwtPayload;
		req.user = decoded;
		
	} catch {
		return reply.status(401).send({ message: "The login token has expired" });
	}
}
